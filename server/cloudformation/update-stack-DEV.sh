AWS_PROFILE=clubsports

aws cloudformation update-stack \
	--stack-name TMPaymentsDEV \
	--template-body file://templates/ClubSportsPayments.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters file://templates/stack-params-DEV.json