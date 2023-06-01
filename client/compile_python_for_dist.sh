#!/bin/bash

#Make sure this script is ran in the folder with all the python scripts

#Get the path of the script
SCRIPT_PATH="\$0"

# Set the input and output directories
INPUT_DIR_PATH="$(dirname "$SCRIPT_PATH")"
OUTPUT_DIR="../src/main/python_clis"

python_clis=("add_friend.py" "create_chat.py" "get_messages.py" "join_chat.py"  "leave_chat.py" "list_chats.py" "list_users.py"  "send_message.py" "set_bio.py")

for cli in "${python_clis[@]}"; do

    # Use PyInstaller to create a standalone executable of the Python file
    pyinstaller "$INPUT_DIR_PATH/$cli" --onefile -y --distpath "$OUTPUT_DIR"
done