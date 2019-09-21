cd $1
zip -r code *
mv code.zip ..
cd ..
aws lambda update-function-code --function-name $1 --zip-file "fileb://code.zip" --region eu-west-3
