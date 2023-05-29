#!/usr/bin/bash
build_dir="build"
working_dir="$build_dir/working"
api_endpoints=("AddFriend" "JoinChat" "CreateChat" "LeaveChat" "ListChats" "ListUsers" "ReceiveMessages" "SendMessage" "SetBio")

# Setup zip environment
mkdir $working_dir 
cp stego.py $working_dir
cp helpers.py $working_dir
cp config.ini $working_dir
cp image.png $working_dir
pip3 install -r requirements.txt --target $working_dir 

# Create lambda zips
for name in "${api_endpoints[@]}"; do
    zip_name="$name".zip
    cp ./api/$name/lambda_function.py $working_dir

    cd $working_dir
    zip -r ../$zip_name * 
    cd ../..

    rm $working_dir/lambda_function.py
done

# Cleanup
rm -r $working_dir