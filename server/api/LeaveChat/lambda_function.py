from helpers import *

def lambda_handler(event, context):
    # Read message + chat_id
    print("Extracting info...")
    coder = StegoTranscoder()
    request = load_stego_body(event, coder)

    chat_id = request["chat_id"]
    username = extract_username(event)

    # Establish Connection
    print("Establishing connection...")
    connection = get_connection()
    cursor = connection.cursor()

    # Ensure chat exists 
    print("Checking chat status...")
    if not does_chat_exist(cursor, chat_id):
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Chat does not exist"}'
        }

    # Leave chat 
    print("Leave chat...")
    if not leave_chat(cursor, chat_id, username)
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Failed to leave chat"}'
        }
    cursor.close()
    
    # Return response 
    print("Responding...")
    message_bytes = json.dumps({"success": True}).encode("utf-8")
    body = create_stego_response(message_bytes, coder)
    response = {"statusCode": 200, "body": None}

    cursor.close()
    if body is not None:
        connection.commit()
        response["body"] = body
    else:
        response["statusCode"] = 500
        response["body"] = '{"error": "Failed to create response"}' 
    
    # Commit transaction
    connection.close()
    return response


