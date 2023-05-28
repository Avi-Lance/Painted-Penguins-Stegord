import os
import json
import base64
import shutil
import requests
import tempfile
from stego import StegoTranscoder

if __name__ == "__main__":
  in_fname = "image.png"
  out_fname = tempfile.NamedTemporaryFile()

  coder = StegoTranscoder()
  message = json.dumps({"new": True}).encode("utf-8")
  if not coder.encode(message, in_fname, out_fname):
    print("Error: failed to encode")
    os.exit(1)

  body = None
  with open(out_fname, "rb") as fp:
    body = base64.b64encode(fp.read())
  os.remove(out_fname)

  out_fname = tempfile.NamedTemporaryFile()
  resp = requests.post(body, headers={'username': 'test_user'}, stream=True)
  with open(out_fname, "wb") as fp:
    shutil.copyfileobj(resp.raw, fp)
  del resp

  message = coder.decode(out_fname)
  if message is None:
    print("Error: Failed to decode message")
    os.exit(1)

  print("Message: ", message.decode('utf-8'))

