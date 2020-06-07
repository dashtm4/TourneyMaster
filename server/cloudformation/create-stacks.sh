# Inputs:
#	ClubSportsPayments.yaml - template
#   stack-params.json - parameters
#
AWS_PROFILE=clubsports

# aws cloudformation create-stack \
# 	--stack-name TMPaymentsPROD \
# 	--template-body file://templates/ClubSportsPayments.yaml \
# 	--capabilities CAPABILITY_NAMED_IAM \
# 	--client-request-token TMPaymentsPROD \
# 	--parameters file://templates/stack-params-PROD.json

# aws cloudformation create-stack \
# 	--stack-name TMPaymentsSTAGING \
# 	--template-body file://templates/ClubSportsPayments.yaml \
# 	--capabilities CAPABILITY_NAMED_IAM \
# 	--client-request-token TMPaymentsSTAGING \
# 	--parameters file://templates/stack-params-STAGING.json

aws cloudformation create-stack \
	--stack-name TMPaymentsDEV \
	--template-body file://templates/ClubSportsPayments.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--client-request-token TMPaymentsDEV \
	--parameters file://templates/stack-params-DEV.json