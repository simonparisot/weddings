cd $1
zip -r code *
mv code.zip ..
cd ..
aws lambda update-function-code --function-name $2 --zip-file "fileb://code.zip" --region eu-west-1 --profile perso
