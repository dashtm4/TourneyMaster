#!/bin/bash
# uploadLambdaCode.sh
# Author: GMind LLC
# Date: 04/28/2020

AWS_PROFILE="clubsports"

rm -Rf dist/*
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
aws lambda update-function-configuration --function-name "TourneyMasterPayments-SyncProductsFunction" \
  --environment "Variables={STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY}"

aws lambda update-function-code --function-name "TourneyMasterPayments-PaymentsApiFunction" --zip-file "fileb://dist/bundle.zip"
aws lambda update-function-configuration --function-name "TourneyMasterPayments-PaymentsApiFunction" \
  --environment "Variables={STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY}"
