from helpers import *

def update_bio(cursor, username, bio):
    query = "UPDATE account SET bio = %s WHERE id = %s RETURNING id"
    cursor.execute(query, (bio, username))
    row = cursor.fetchone()
    if row is not None and row[0] == username:
        return True
    return False

def lambda_handler(event, context):
    # Read message + chat_id
    print("Extracting info...")
    coder = StegoTranscoder()
    request = load_stego_body(event, coder)

    bio = request["bio"]
    username = extract_username(event)

    # Establish Connection
    print("Establishing connection...")
    connection = get_connection()
    cursor = connection.cursor()

    # Ensure user is in chat
    print("Checking user status...")
    if not does_user_exist(cursor, username):;
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "User does not exist"}'
        }

    # update bio 
    print("Writing bio...") 
    if not update_bio(cursor, username, bio): 
        cursor.close()
        connection.close()
        return {
            "statusCode": 500,
            "body": '{"error": "Failed to write bio"}'
        }
    
    # Return response 
    print("Creating response...")
    message_bytes = json.dumps({"success": True}).encode("utf-8")
    body = create_stego_response(message_bytes, coder)
    response = {"statusCode": 200, "body": None}

    print("Responding")
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


