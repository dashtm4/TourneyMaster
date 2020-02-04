## Intelligence on the APIs

APIs are governed by API Gateway. What is needed is the IdToken from Cognito. The sample user from the TourneyMaster Cognito User Pool is:

username = api_demo@tourneymaster.org
pword = ThisisNotMyRealPasswordJohnok?

### AWS COGNITO

Once a user is created in Cognito it needs to be confirmed. The following two CLI commands will confirm:

```` aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_KCFCcxsf4 --client-id 4e6uq8b4f1f4q5ql8qe10cqfdc --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=<user name>,PASSWORD=<password>````


The above command returns a session token that needs to be cut/paste into the next command to confirm:

````aws cognito-idp admin-respond-to-auth-challenge --user-pool-id us-east-1_KCFCcxsf4 --client-id 4e6uq8b4f1f4q5ql8qe10cqfdc --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=<password>,USERNAME=<user name> --session "<session token>"````

After the above command one might need to "NEW_PASSWORD_REQUIRED", so use the following CLI syntax by replacing within the "%"s with your variables
````aws cognito-idp admin-respond-to-auth-challenge --user-pool-id %USER POOL ID% --client-id %CLIENT ID% --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=%DESIRED PASSWORD%,USERNAME=%USERS USERNAME% --session %SESSION KEY FROM PREVIOUS COMMAND with ""%````

For Example
````aws2 cognito-idp admin-respond-to-auth-challenge --user-pool-id us-east-1_KCFCcxsf4 --client-id 4e6uq8b4f1f4q5ql8qe10cqfdc --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=%password%,USERNAME=kovalov.oleksandr@binary-studio.com --session "<session token from above step in between quotes>"````

There doesn't appear any way to delete a Cognito user using the Console. The following CLI command can do this:

````aws cognito-idp admin-delete-user --user-pool-id us-east-1_KCFCcxsf4 --username <user name>````

To generate authentication tokens via CLI (the IdToken is good for 1 hour):

````aws2 cognito-idp admin-initiate-auth --user-pool-id us-east-1_KCFCcxsf4 --client-id 4e6uq8b4f1f4q5ql8qe10cqfdc --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=api_demo@tourneymaster.org,PASSWORD=ThisisNotMyRealPasswordJohnok?````

### Insomnia (or Apigee, Kong, etc.) to test APIs
To utilize the APIs, users need an IDToken to do CRUD operations on the database using the API.
<img src="https://miscellaneous312.s3.amazonaws.com/CLI+to+get+IDToken.png"
     alt="CLI Token"
     style="float: left; margin-right: 10px;" />

Then, once the IDToken is obtained, the below screenshot shows an example of how to structure an API call. One could also utilize a CURL command just as easily.
<img src="https://miscellaneous312.s3.amazonaws.com/Sample+Insomnia+call+to+GET+event_master+API.png"
     alt="Sample Call"
     style="float: left; margin-right: 10px;" />
____

### API GATEWAY
#### Events (events.event_master)
1. GET (all): https://api.tourneymaster.org/v1/events
1. GET (specific event): https://api.tourneymaster.org/v1/events?event_id=ABC123  VARCHAR(8)
1. POST: https://api.tourneymaster.org/v1/events?event_id/events (VARCHAR(8) please...)
1. DELETE: https://api.tourneymaster.org/v1/events?event_id=ABC123 VARCHAR(8)

#### Facilities (events.facilities)
1. GET (all): https://api.tourneymaster.org/v1/facilities
1. GET (specific facility): https://api.tourneymaster.org/v1/facilities?facilities_id=ABC123 VARCHAR(8)
1. POST: https://api.tourneymaster.org/v1/facilities
1. DELETE: https://api.tourneymaster.org/v1/facilities?facilities_id=ABC123 VARCHAR(8)

#### Fields (events.fields)
1. GET (all): https://api.tourneymaster.org/v1/fields
1. GET (specific facility): https://api.tourneymaster.org/v1/fields?fields_id=ABC123 VARCHAR(8)
1. POST: https://api.tourneymaster.org/v1/fields
1. DELETE: https://api.tourneymaster.org/v1/fields?fields_id=ABC123 VARCHAR(8)

#### Members (events.members)
1. GET (all): https://api.tourneymaster.org/v1/members
1. GET (specific member): https://api.tourneymaster.org/v1/members?member_id=ABC123 VARCHAR(8)
1. POST: https://api.tourneymaster.org/v1/members
1. DELETE: https://api.tourneymaster.org/v1/members?member_id=ABC123 VARCHAR(8)
