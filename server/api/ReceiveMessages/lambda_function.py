import json
import psycopg2
from stego import StegoTranscoder
from helpers import * 

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
  connection.commit()
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
