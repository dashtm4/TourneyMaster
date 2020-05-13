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
  --environment "Variables={SMParameterName=$SM_PARAMETER_NAME,STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL}"

aws lambda update-function-code --function-name "TourneyMasterPayments-PaymentsApiFunction" --zip-file "fileb://dist/bundle.zip"
aws lambda update-function-configuration --function-name "TourneyMasterPayments-PaymentsApiFunction" \
  --environment "Variables={SMParameterName=$SM_PARAMETER_NAME,STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL,STRIPE_WEBHOOK_SIGNING_SECRET=$STRIPE_WEBHOOK_SIGNING_SECRET}"
