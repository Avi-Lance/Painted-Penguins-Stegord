import os
import jwt
import json
import base64
import tempfile
import psycopg2
from configparser import ConfigParser
from stego import StegoTranscoder

# Credentials for prod postgres DB
CREDENTIALS = {
  "username": "postgres",
  "password": "stegordtest",
  "host": "stegord-test-psql.cmljfd4tgf0o.us-west-2.rds.amazonaws.com",
  "port": "5432",
  "database": "stegord"
}

# Image files
MEDIUM_IMAGE_NAME = "image.png"

# extract_username returns the username associated with the auth token
def extract_username(event):
  """
  token = event["headers"]["Authorization"]
  decoded = jwt.decode(token, options={"verify_signature": False})
  return decoded["cognito:username"]
  """
  return event["headers"]["username"]

def get_connection():
  parser = ConfigParser()
  parser.read("config.ini")
  connection = psycopg2.connect(user=parser.get("database", "username"),
                              password=parser.get("database", "password"),
                              host=parser.get("database", "host"),
                              port=parser.get("database", "port"),
                              database=parser.get("database", "db_name")
  )

  return connection

def get_last_read_message_number(cursor, username):
  query = "SELECT last_read_message_id FROM account WHERE id = %s"
  cursor.execute(query, (username,))
  row = cursor.fetchone()
  if row is not None:
    return row[0]
  return None

def get_messages(cursor, username, intake_n):
  # Get chat memberships
  query = "SELECT chat_id FROM chat_participants WHERE account_id = %s"
  cursor.execute(query, (username,))
  chat_ids = []
  row = cursor.fetchone()
  while row is not None:
    chat_ids.append(row[0])
    row = cursor.fetchone()

  # Get messages
  query = "SELECT (account_id, intake_order, content) FROM messages WHERE chat_id = %s AND intake_order >= %s"
  messages = {}
  max_read_message = intake_n
  for chat_id in chat_ids:
    cursor.execute(query, (chat_id, intake_n))
    row = cursor.fetchone()
    while row is not None:
      if chat_id not in messages:
        messages[chat_id] = []

      messages[chat_id].append({
        "sender": row[0],
        "order_num": row[1],
        "message": row[2]
      })
      max_read_message = max(max_read_message, row[1])
      row = cursor.fetchone()

  # Update last read message
  query = "UPDATE account SET last_read_message_id = %s WHERE id = %s RETURNING id"
  cursor.execute(query, str(max_read_message), username)

  response = cursor.fetchone()
  if response is None or response[0] != username:
    print("[ERROR] Failed to update last message read order number")
  return messages

def load_stego_body(event, coder):
  # Read image
  b64_data = event["body"]
  raw_data = base64.b64decode(b64_data)

  temp_fname = tempfile.NamedTemporaryFile()
  with open(temp_fname, "wb") as fp:
    fp.write(raw_data)

  # Decode image
  message_raw = coder.decode(temp_fname)
  message = json.loads(message_raw.decode("utf-8"))
  os.remove(temp_fname)
  return message

def create_stego_response(message_bytes, coder):
  # Encode data into an image
  out_fname = tempfile.NamedTemporaryFile()
  if not coder.encode(message_bytes, MEDIUM_IMAGE_NAME, out_fname):
    return None

  # Read image bytes
  image_bytes = None
  with open(out_fname, "rb") as fp:
    image_bytes = base64.b64encode(fp.read())
  return image_bytes


def lambda_handler(event, context):
  # Read request
  coder = StegoTranscoder()
  request = load_stego_body(event, coder)

  # Establish connection
  connection = get_connection()
  cursor = connection.cursor()

  # Read query data
  username = extract_username(event)
  intake_n = 0
  if request["new"]:
    intake_n = get_last_read_message_number(cursor, username)
    if intake_n is None:
      cursor.close()
      connection.close()
      return {
        "statusCode": 500,
        "body": '{"error": "Failed to query user account id"}'
      }

  # Read and encode messages
  messages = get_messages(cursor, username, intake_n)
  message_bytes = json.dumps(messages).encode("utf-8")
  body = create_stego_response(message_bytes, coder)

  # Return
  cursor.close()
  connection.close()
  if body is not None:
    return {
      "statusCode": 200,
      "body": body
    }
  return {
    "statusCode": 500,
    "body": '{"error": "Failed to encode response"}'
  }
