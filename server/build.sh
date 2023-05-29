#!/usr/bin/bash
build_dir="build"
working_dir="$build_dir/working"
api_endpoints=("AddFriend" "JoinChat" "LeaveChat" "ListChats" "ListUsers" "ReceiveMessages" "SendMessage" "SetBio")

mkdir $working_dir 
pip3 install -r requirements.txt --target $working_dir 

for name in "${api_endpoints[@]}"; do
    zip_name="$name".zip
    cp ./$name/lambda_function.py $working_dir
    zip -r $build_dir/$zip_name $name
    rm $working_dir/lambda_function.py

done