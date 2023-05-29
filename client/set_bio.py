import sys
import json
from helpers import *
from stego import StegoTranscoder

if __name__ == "__main__":
  # Read parameters
  in_fname = sys.argv[1]
  bio = sys.argv[2]
  cognito_token = sys.argv[3]
  resource = get_api_url() + "/set_bio"

  # Encode message in image 
  coder = StegoTranscoder()
  message = json.dumps({"bio": bio}).encode("utf-8")
  response = send_stego_post(message, in_fname, coder, resource, cognito_token)
  if response is None: 
    sys.exit(1)
  print(response)
  
 