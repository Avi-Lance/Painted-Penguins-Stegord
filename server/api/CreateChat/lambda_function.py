from helpers import *

def lambda_handler(event, context):
    # Read message + chat_name
    print("Extracting info...")
    coder = StegoTranscoder()
    request = load_stego_body(event, coder)

    chat_name = request["chat_name"]
    username = extract_username(event)

    # Establish Connection
    print("Establishing connection...")
    connection = get_connection()
    cursor = connection.cursor()

    # Create chat 
    print("Creating chat...")
    chat_id = create_chat(cursor, chat_name)
    if chat_id is None: 
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Failed to create chat"}'
        }
    
    # Join chat
    if not join_chat(cursor, chat_id, username):
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Failed to join chat"}'
        }
    cursor.close()
    
    # Return response 
    print("Responding...")
    message_bytes = json.dumps({"chat_id": chat_id}).encode("utf-8")
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


