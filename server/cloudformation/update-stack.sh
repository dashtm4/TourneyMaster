AWS_PROFILE=clubsports

aws cloudformation update-stack \
	--stack-name ClubSportsPaymentsStack \
	--template-body file://templates/ClubSportsPayments.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters file://stack-params.json