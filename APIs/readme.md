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
````aws2 cognito-idp admin-respond-to-auth-challenge --user-pool-id us-east-1_KCFCcxsf4 --client-id 4e6uq8b4f1f4q5ql8qe10cqfdc --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=%password%,USERNAME=kovalov.oleksandr@binary-studio.com --session "7c3rSGEmd56W7U-XrECZa6bqAa5TgKFL0iC1XxukkXEuwVTipWKOWyEaVMQts5s0mPENFEcL4QBHvJfUGwZI0ex8eZxCE6JGJ9oerw-rVyKGg4NM78GyGxwYowA_Rs2Yu7FGzkswlzgKIKEHRlXG1kkiHY41CA156q0NSjq1LuYFOpq7v568jW2wGRc5gqhauCItl4wn0pyB9krvGxFKonVjx7zYT5WfHufQwc7tqJR97EN4rQMJ4h_8vhiAHoPPX_uNR0pjMWhmch_pfElO3Noopo-uMNGNRY6BnNfuVhmbGPmqBMWWc6L696kFF0tJOC1snKB3SJYyL-_K9lmxr5xnhsO1WD1FRR0rpw3gF0im1wieep1FYANw_lzPSCuNdaYuWHglUFuqe1ukRn0Dmwe1R_gcns29eVkPgtjLeumuN89omPCS3DRET6yxQ1RvCBqSpTOYMEW_uYeW05CJEzQxAlCVzCmmLhq_3HInh8U_y9zTuwFcMlLTaeJeeUx4gDiyE6KxzjXHHsribzuta1GAtgzbG508uwfNL5DcB15-D4QThfU3mZG6HMkchKaJpgu3KZEKoqbUY-wwVRa00WudbkteBijqOPFVFxTQDF76s3TNgC4_OqxlSwXJ0YjI5WCFeooEo7boIM840_WpGRHDFJvde6olMlR7F0jTCIrXR0o8349VXqfFUYSu-7AYuZCe0tNsWf7ja-hg7mw-uqK0-eV8Bfl-Qey8zF4J4aZWYvPdzBKyOJbIqU_jO0cvD7rja7rMW5wPujfwiY4FCI8ur2XHuuULo0OpJBQgbFTHjsy0lWdzBpr1Ov5wwWKIzQg-wwOxitNvwHgtCQ88oh6d7L6_ucQ8c0Vf3Q6Gpq3ZfJmkPb5z8ofnYRfP56-aYyuFpIDFMd7n9ARBFRNRU-Jq1m9UrbOKR-Q1PLfnvJiO0qVx5PDhNfVOTFNE8T6_AKgNBtSEJypbnpRnPgEjDJahDRu3e2sLlywg-gT0qz914ASK"````

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

#### Members (events.members)
1. GET (all): https://api.tourneymaster.org/v1/members
1. GET (specific member): https://api.tourneymaster.org/v1/members?member_id=ABC123 VARCHAR(8)
1. POST: https://api.tourneymaster.org/v1/members
1. DELETE: https://api.tourneymaster.org/v1/members?member_id=ABC123 VARCHAR(8)
