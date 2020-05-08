#!/bin/bash
# uploadLambdaCode.sh
# Author: GMind LLC
# Date: 04/28/2020

AWS_PROFILE="clubsports"

# FunctionName="TourneyMasterPayments-SyncProductsFunction"

rm -R dist/*
mkdir -p ./dist/lambda
npm run build
pushd ./dist/lambda
cp ../../package.json .

mkdir -p node_modules
npm install --production
rm package*.json
touch package.json
zip -r ../bundle.zip *
popd

aws lambda update-function-code --function-name "TourneyMasterPayments-SyncProductsFunction" --zip-file "fileb://dist/bundle.zip"
aws lambda update-function-code --function-name "TourneyMasterPayments-PaymentsApiFunction" --zip-file "fileb://dist/bundle.zip"