from helpers import *

def add_friend(cursor, user_one, user_two):
    # Create chat 
    chat_id = create_chat(cursor, user_one + "/" + user_two)
    if chat_id is None:
        return None

    # Add both users to chat
    if not join_chat(cursor, chat_id, user_one) or not join_chat(cursor, chat_id, user_two):
        return None
    
    # Create friendship
    query = "INSERT INTO friends (account_one, account_two, chat_id) VALUES (%s, %s, %s) RETURNING account_one"
    cursor.execute(query, (user_one, user_two, chat_id))
    row = cursor.fetchone()
    if row is not None and row[0] == user_one:
        return chat_id
    return None

def lambda_handler(event, context):
    # Read message + friend_id
    print("Extracting info...")
    coder = StegoTranscoder()
    request = load_stego_body(event, coder)

    friend_id = request["friend_id"]
    username = extract_username(event)

    # Establish Connection
    print("Establishing connection...")
    connection = get_connection()
    cursor = connection.cursor()

    # Ensure user exists 
    print("Checking user status...")
    if not does_user_exist(cursor, friend_id):
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "User does not exist"}'
        }

    # Create friendship 
    print("Creating friendship...")
    chat_id = add_friend(cursor, username, friend_id)
    if chat_id is None:
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Failed to add friend"}'
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


