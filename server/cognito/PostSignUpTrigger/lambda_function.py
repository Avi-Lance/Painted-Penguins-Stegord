from helpers import *

def lambda_handler(event, context):
    # Get username parameter
    username = event["userName"]

    # Check if username exists 
    connection = get_connection()
    cursor = connection.cursor()

    if does_user_exist(cursor, username):
        raise Exception("Username already exists")

    # Attempt to create resource
    query = "INSERT INTO account (id, last_read_message_id, bio) VALUES (%s, %s, %s) RETURNING id"
    cursor.execute(query, (username, 0, "N/A"))
    row = cursor.fetchone()
    if row is None or row[0] != username:
        raise Exception("Failed to insert user data into database")
    
    # Commit transaction and close
    cursor.close()
    connection.commit()
    connection.close()
    return event

