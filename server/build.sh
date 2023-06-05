#!/usr/bin/bash
build_dir="build"
working_dir="$build_dir/working"
api_endpoints=("AddFriend" "JoinChat" "CreateChat" "LeaveChat" "ListChats" "ListUsers" "ReceiveMessages" "SendMessage" "SetBio")

# Setup zip environment
mkdir $build_dir
mkdir $working_dir 
cp stego.py $working_dir
cp helpers.py $working_dir
cp config.ini $working_dir
cp image.png $working_dir
python3.10 -m pip install -r requirements.txt --target $working_dir 

# Create api lambda zips
for name in "${api_endpoints[@]}"; do
    zip_name="$name".zip
    cp ./api/$name/lambda_function.py $working_dir

    cd $working_dir
    zip -r ../$zip_name * 
    cd ../..

    rm $working_dir/lambda_function.py
done

# Create cognito trigger lambda zip
cp ./cognito/PostSignUpTrigger/lambda_function.py $working_dir
cd $working_dir
zip -r ../CognitoSignUpTrigger.zip *
cd ../..

# Cleanup
rm -r $working_dir