import os
import sys
import json
import base64
import shutil
import requests
import tempfile
from stego import StegoTranscoder

def read_args():
  in_img = sys.argv[1]
  all_messages = (sys.argv[2] == "all")
  cognito_token = sys.argv[3]

if __name__ == "__main__":
  # Read parameters
  in_fname = sys.argv[1]
  new_messages = (sys.argv[2] != "all")
  cognito_token = sys.argv[3]

  # Encode message in image 
  out_fname = tempfile.NamedTemporaryFile().name + ".png"
  coder = StegoTranscoder()
  message = json.dumps({"new": new_messages}).encode("utf-8")
  if not coder.encode(message, in_fname, out_fname):
    print("Error: failed to encode")
    sys.exit(1)

  # Convert image to b64 encoded bytes object
  body = None
  with open(out_fname, "rb") as fp:
    body = fp.read() 
  os.remove(out_fname)

  # Make API request
  resp = requests.post(
    url="https://91c4xsiu5h.execute-api.us-west-2.amazonaws.com/get_messages",
    data=body,
    headers={'authorization': cognito_token},
    stream=True
  )
  if resp.status_code != 200:
    print("Status: ", resp.status_code)
    print("Error: ", resp.json())
    sys.exit(1)

  # Read bytes object from reponse
  data = base64.b64decode(resp.content)
  out_fname = tempfile.NamedTemporaryFile().name + ".png"
  with open(out_fname, "wb") as fp:
    fp.write(data)
  del resp

  # Decode message from image
  message = coder.decode(out_fname)
  if message is None:
    print("Error: Failed to decode message")
    sys.exit(1)

  # Return message
  print(message.decode('utf-8'))
