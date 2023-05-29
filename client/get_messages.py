import sys
import json
from helpers import *
from stego import StegoTranscoder

if __name__ == "__main__":
  # Read parameters
  in_fname = sys.argv[1]
  new_messages = (sys.argv[2] != "all")
  cognito_token = sys.argv[3]
  resource = get_api_url() + "/get_messages"

  # Encode message in image 
  coder = StegoTranscoder()
  message = json.dumps({"new": new_messages}).encode("utf-8")
  response = send_stego_post(message, in_fname, coder, resource, cognito_token)
  if response is None: 
    sys.exit(1)
  print(response)
  
  