from helpers import *

def is_user_in_chat(cursor, username, chat_id):
    query = "SELECT account_id FROM chat_participants WHERE account_id = %s AND chat_id = %s"
    cursor.execute(query, (username, chat_id))
    row = cursor.fetchone()
    if row is not None and row[0] == username:
        return True
    return False

def write_message_to_chat(cursor, username, chat_id, message):
    query = "INSERT INTO messages (account_id, chat_id, content) VALUES (%s, %s, %s) RETURNING account_id"
    cursor.execute(query, (username, chat_id, message))

    row = cursor.fetchone()
    if row is None or row[0] != username:
        print("[ERROR] Failed to write message to database")
        return False
    return True

def lambda_handler(event, context):
    # Read message + chat_id
    print("Extracting info...")
    coder = StegoTranscoder()
    request = load_stego_body(event, coder)

    message = request["message"]
    chat_id = request["chat_id"]
    username = extract_username(event)

    # Establish Connection
    print("Establishing connection...")
    connection = get_connection()
    cursor = connection.cursor()

    # Ensure user is in chat
    print("Checking user status...")
    if not is_user_in_chat(cursor, username, chat_id):
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "User not in chat"}'
        }

    # Add message to chat
    print("Writing message to chat...")
    if not write_message_to_chat(cursor, username, chat_id, message):
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Failed to write message to chat"}'
        }
    
    # Get messages for return
    print("Retrieving messages...")
    last_read_n = get_last_read_message_number(cursor, username)
    messages = get_messages(cursor, username, last_read_n)
    message_bytes = json.dumps(messages).encode("utf-8")
    body = create_stego_response(message_bytes, coder)
    response = {"statusCode": 200, "body": None}

    print("Responding")
    cursor.close()
    if body is not None:
        connection.commit()
        response["body"] = body
    else:
        response["statusCode"] = 500
        response["body"] = '{"error": "Failed to retrieve messages"}' 
    
    # Commit transaction
    connection.close()
    return response


