from helpers import *
from stego import StegoTranscoder

def lambda_handler(event, context):
    # Establish DB connection
    connection = get_connection()
    cursor = connection.cursor()

    # Query for users and bios
    query = "SELECT id, bio FROM account"
    cursor.execute(query)

    # Fetch information
    row = cursor.fetchone()
    user_list = {}
    while row is not None:
        user_list[row[0]] = row[1]
        row = cursor.fetchone()
    cursor.close()
    connection.close()
    
    coder = StegoTranscoder()
    message = json.dumps(user_list).encode("utf-8")
    body = create_stego_response(message, coder)

    if body is not None:
        return {
            "statusCode": 200,
            "body": body
        }
    return {
        "statusCode": 500,
        "body": '{"error": "Failed to retrieve list of users"}'
    }



    

