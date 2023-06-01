import sys
import json
from helpers import *
from stego import StegoTranscoder

if __name__ == "__main__":
  # Read parameters
  in_fname = sys.argv[1]
  chat_id = sys.argv[2]
  message = sys.argv[3]
  cognito_token = sys.argv[4]
  resource = get_api_url() + "/send_message"

  # Encode message in image 
  coder = StegoTranscoder()
  message = json.dumps({"chat_id": chat_id, "message": message}).encode("utf-8")
  response = send_stego_post(message, in_fname, coder, resource, cognito_token)
  if response is None: 
    sys.exit(1)
  print(response)
  
 