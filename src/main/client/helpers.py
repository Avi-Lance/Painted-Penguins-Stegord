import base64
import requests
import tempfile
import os
from configparser import ConfigParser

def get_api_url():
    return "https://m7sie9te7j.execute-api.us-west-2.amazonaws.com/prod/"

def send_stego_post(message_bytes, medium_image, coder, resource, auth_token, post=True):
  # Encode message in image
  resp = None
  if post:
    out_fname = tempfile.NamedTemporaryFile().name + ".png"
    if not coder.encode(message_bytes, medium_image, out_fname):
        print("[ERROR] Failed to encode message")
        return None

    body = None
    with open(out_fname, "rb") as fp:
        body = base64.b64encode(fp.read()).decode("utf-8")
    os.remove(out_fname)

    # Send post request to resource
    resp = requests.post(
        url=resource,
        data=body,
        headers={'Authorization': auth_token},
        stream=True
    )
  else:
    resp = requests.get(
        url=resource,
        headers={'Authorization': auth_token},
        stream=True
    )

  if resp.status_code != 200:
    print("[ERROR STATUS]", resp.status_code)
    print("[ERROR MESSAGE]", resp.content.decode("utf-8"))
    return None

  # Read bytes object from reponse
  data = base64.b64decode(resp.content)
  out_fname = tempfile.NamedTemporaryFile().name + ".png"
  with open(out_fname, "wb") as fp:
    fp.write(data)
  del resp

  # Decode message from image
  message = coder.decode(out_fname)
  if message is None:
    print("[ERROR] Failed to decode message")
    return None
  os.remove(out_fname)

  return message.decode("utf-8")
