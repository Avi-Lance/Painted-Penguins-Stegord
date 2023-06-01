import sys
import json
from helpers import *
from stego import StegoTranscoder

if __name__ == "__main__":
  # Read parameters
  cognito_token = sys.argv[1]
  resource = get_api_url() + "/list_chats"

  # Encode message in image 
  coder = StegoTranscoder()
  response = send_stego_post(None, None, coder, resource, cognito_token, post=False)
  if response is None: 
    sys.exit(1)
  print(response)
  
 