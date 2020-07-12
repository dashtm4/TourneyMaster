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
zip -r ../bundle.zip *
popd

# STACK_NAME="TourneyMasterPayments"

if [ -z "$STACK_NAME" ] 
then
  STACK_NAME="TourneyMasterPayments"
	echo "\$STACK_NAME is empty. Using default value STACK_NAME=$STACK_NAME"
else
	echo "STACK_NAME=$STACK_NAME"
fi

aws lambda update-function-code --function-name "$STACK_NAME-SyncProductsFunction" --zip-file "fileb://dist/bundle.zip"
aws lambda update-function-configuration --function-name "$STACK_NAME-SyncProductsFunction" \
  --environment "Variables={PUBLIC_API_SM_PARAMETER_NAME=$PUBLIC_API_SM_PARAMETER_NAME,\
  STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY,\
  EVENT_NOTIFICATIONS_TOPIC="arn:aws:sns:us-east-1:564748484972:$STACK_NAME-ErrorsTopic",\
  STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,\
  PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL}"

aws lambda update-function-code --function-name "$STACK_NAME-PaymentsApiFunction" --zip-file "fileb://dist/bundle.zip"
aws lambda update-function-configuration --function-name "$STACK_NAME-PaymentsApiFunction" \
  --environment "Variables={MAX_PAYMENT_AMOUNT=$MAX_PAYMENT_AMOUNT,\
  PUBLIC_API_SM_PARAMETER_NAME=$PUBLIC_API_SM_PARAMETER_NAME,\
  PRIVATE_API_SM_PARAMETER_NAME=$PRIVATE_API_SM_PARAMETER_NAME,\
  STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY,\
  STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,\
  PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL,\
  EVENT_NOTIFICATIONS_TOPIC="arn:aws:sns:us-east-1:564748484972:$STACK_NAME-ErrorsTopic",\
  USER_EVENTS_TOPIC="arn:aws:sns:us-east-1:564748484972:$STACK_NAME-UserEventsTopic",\
  STRIPE_WEBHOOK_SIGNING_SECRET=$STRIPE_WEBHOOK_SIGNING_SECRET,\
  STRIPE_CONNECT_WEBHOOK_SIGNING_SECRET=$STRIPE_CONNECT_WEBHOOK_SIGNING_SECRET}"

aws lambda update-function-code --function-name "$STACK_NAME-ServicesApiFunction" --zip-file "fileb://dist/bundle.zip"
aws lambda update-function-code --function-name "$STACK_NAME-SendEmailFunction" --zip-file "fileb://dist/bundle.zip"
