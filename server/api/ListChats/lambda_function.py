from helpers import *

def list_chats(cursor, username):
    response = {
        "friends": {},
        "groups": {}
    }

    # Get chat memberships
    chat_ids = get_chat_memberships()

    # Get chat names
    query = "SELECT chat_name FROM chat WHERE id = %s"
    for chat_id in chat_ids:
        cursor.execute(query, (chat_id,))
        row = cursor.fetchone()
        if row is None:
            return None
        response["groups"][chat_id] = row[0] 

    # Get friend chats
    query = "SELECT account_one, account_two, chat_id FROM friends WHERE account_one = %s OR account_two = %s"
    cursor.execute(query, (username, username))
    row = cursor.fetchone()
    while row is not None:
        friend = row[0]
        if friend == username:
            friend = row[1]
        chat_id = row[2]
        
        response["friends"][chat_id] = friend 
        if chat_id in response["groups"]:
            del response["groups"][chat_id]
        row = cursor.fetchone()
    
    return response

def lambda_handler(event, context):
    # Extract username from token
    username = extract_username(event)

    # Establish Connection
    print("Establishing connection...")
    connection = get_connection()
    cursor = connection.cursor()


    # Retrieve user chats 
    chats = list_chats(cursor, username)
    if chats is None: 
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Failed to read users chats"}'
        }

    # Return response 
    print("Responding...")
    message_bytes = json.dumps(chats).encode("utf-8")
    body = create_stego_response(message_bytes, coder)
    response = {"statusCode": 200, "body": None}

    cursor.close()
    if body is not None:
        response["body"] = body
    else:
        response["statusCode"] = 500
        response["body"] = '{"error": "Failed to create response"}' 
    
    # Commit transaction
    connection.close()
    return response


