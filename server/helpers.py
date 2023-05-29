import tempfile  
import base64
import jwt
import os
import json
import psycopg2
from configparser import ConfigParser
from stego import StegoTranscoder

MEDIUM_IMAGE_NAME = "image.png"

def extract_username(event):
  """
  token = event["headers"]["authorization"]
  decoded = jwt.decode(token, options={"verify_signature": False})
  return decoded["cognito:username"]
  """
  return event["headers"]["authorization"]

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

def load_stego_body(event, coder):
  # Read image
  raw_data = base64.b64decode(event["body"])

  temp_fname = tempfile.NamedTemporaryFile().name + ".png"
  with open(temp_fname, "wb") as fp:
    fp.write(raw_data)

  # Decode image
  message_raw = coder.decode(temp_fname)
  message = json.loads(message_raw.decode("utf-8"))
  os.remove(temp_fname)
  return message

def create_stego_response(message_bytes, coder):
  # Encode data into an image
  out_fname = tempfile.NamedTemporaryFile().name + ".png"
  if not coder.encode(message_bytes, MEDIUM_IMAGE_NAME, out_fname):
    return None

  # Read image bytes
  image_bytes = None
  with open(out_fname, "rb") as fp:
    image_bytes = base64.b64encode(fp.read())
  return image_bytes

def get_last_read_message_number(cursor, username):
  query = "SELECT last_read_message_id FROM account WHERE id = %s"
  cursor.execute(query, (username,))
  row = cursor.fetchone()
  if row is not None:
    return row[0]
  return None

def get_chat_memberships(cursor, username):
  query = "SELECT chat_id FROM chat_participants WHERE account_id = %s"
  cursor.execute(query, (username,))
  chat_ids = []
  row = cursor.fetchone()
  while row is not None:
    chat_ids.append(row[0])
    row = cursor.fetchone()
  return chat_ids


def get_messages(cursor, username, intake_n):
  # Get chat memberships
  chat_ids = get_chat_memberships(cursor, username)
  
  # Get messages
  query = "SELECT account_id, intake_order, content FROM messages WHERE chat_id = %s AND intake_order > %s"
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
  cursor.execute(query, (max_read_message, username))

  response = cursor.fetchone()
  if response is None or response[0] != username:
    print("[ERROR] Failed to update last message read order number")
  return messages

def does_user_exist(cursor, username):
    query = "SELECT id FROM account WHERE id = %s" 
    cursor.execute(query, (username, ))
    row = cursor.fetchone()
    if row is not None and row[0] == username:
        return True
    return False

def does_chat_exist(cursor, chat_id):
    query = "SELECT id FROM chat WHERE id = %s"
    cursor.execute(query, (chat_id,))
    row = cursor.fetchone()
    print("Given ID: ", chat_id)
    print("Row: ", row)
    if row is not None and row[0] == chat_id:
        return True
    return False

def create_chat(cursor, name):
    query = "INSERT INTO chat (chat_name) VALUES (%s) RETURNING id"
    cursor.execute(query, (name,))
    row = cursor.fetchone()
    if row is not None:
        return row[0]
    return None

def join_chat(cursor, chat_id, account_id):
    query = "INSERT INTO chat_participants (account_id, chat_id) VALUES (%s, %s) RETURNING account_id"
    cursor.execute(query, (account_id, chat_id))
    row = cursor.fetchone()
    if row is not None and row[0] == account_id:
        return True
    return False

def leave_chat(cursor, chat_id, account_id):
    query = "DELETE FROM chat_participants WHERE account_id = %s AND chat_id = %s RETURNING account_id"
    cursor.execute(query, (account_id, chat_id))
    row = cursor.fetchone()
    if row is not None and row[0] == account_id:
        return True
    return False
