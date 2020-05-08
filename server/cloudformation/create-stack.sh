# Inputs:
#	ClubSportsPayments.yaml - template
#   stack-params.json - parameters
#
AWS_PROFILE=clubsports

aws cloudformation create-stack \
	--stack-name ClubSportsPaymentsStack \
	--template-body file://templates/ClubSportsPayments.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--client-request-token ClubSportsPaymentsStack \
	--parameters file://stack-params.json