## Intelligence on the APIs

APIs are governed by API Gateway. What is needed is the IdToken from Cognito. The sample user from the TourneyMaster Cognito User Pool is:

username = api_demo@tourneymaster.org
pword = ThisisNotMyRealPasswordJohnok?

### AWS COGNITO

Once a user is created in Cognito it needs to be confirmed. The following two CLI commands will confirm:

```` aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_KCFCcxsf4 --client-id 4e6uq8b4f1f4q5ql8qe10cqfdc --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=<user name>,PASSWORD=password````


The above command returns a session token that needs to be cut/paste into the next command to confirm:

````aws cognito-idp admin-respond-to-auth-challenge --user-pool-id us-east-1_KCFCcxsf4 --client-id 4e6uq8b4f1f4q5ql8qe10cqfdc --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=password,USERNAME=<user name> --session "<session token>"````

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
#### Events (events.event_master table)
1. GET (all): https://api.tourneymaster.org/v1/events
1. GET (specific event): https://api.tourneymaster.org/v1/events?event_id=<event id>  (sample event_id = ABC123)
1. POST: https://api.tourneymaster.org/v1/events?event_id/events (VARCHAR(8) please...)
1. DELETE: https://api.tourneymaster.org/v1/events?event_id=<event id> 

####POST####  
`https://api.tourneymaster.org/v1/events?event_id/events`

SAMPLE POST DATA: {"event_id":"ABC123","sport_id":1,"org_id":"ABC PROD","event_name":"BIG EVENT","event_description":"Description","event_startdate":"2020-01-01T00:00:00.000Z","event_duration":100,"event_enddate":"2020-01-01T00:00:00.000Z","time_zone_utc":0,"event_format_id":0,"first_game_time":"08:00:00","last_game_end":"10:10:10","primary_location_desc":"Location","num_of_locations":1,"num_of_fields":99,"halftime_duration":"20:00:00","period_duration":"30:00:00","periods_per_game":4,"exclusive_time_ranges_YN":0,"tie_breaker_format_id":0,"min_num_of_games":0,"max_num_of_divisions":0,"max_num_teams_per_division":99,"assoc_docs_URL":"url","division_id":0,"event_logo_path":"logopath","icon_mobile_URL":"mobile url","icon_desktop_URL":"desktop url","back_to_back_warning":null,"is_active_YN":0,"created_by":"4DC8A780","created_datetime":"2020-01-01T12:00:00.000Z","updated_by":"jfc","updated_datetime":"2020-01-01T12:00:00.000Z"}
DELETE: https://tga4qg71wj.execute-api.us-east-1.amazonaws.com/PROD/events?event_id=ABC126

#### Facilities (events.facilities)
1. GET (all): https://api.tourneymaster.org/v1/facilities
1. GET (specific facility): https://api.tourneymaster.org/v1/facilities?facilities_id=<facilities id>
1. POST: https://api.tourneymaster.org/v1/facilities
1. DELETE: https://api.tourneymaster.org/v1/facilities?facilities_id=<facilities id> (VARCHAR(8) please...)
  
####POST:####
`https://api.tourneymaster.org/v1/facilities`

SAMPLE POST DATA: {"facilities_id":"1","event_id":"ABC123","facilities_description":"BIG GREEN FIELD","address1":"123 Main St.","address2":"","city":"Pflugerville","state":"TX","zip":"78700","country":"US","facility_lat":30.4,"facility_long":-97.6,"facility_sort":0,"is_active_YN":0,"in_library_YN":0,"public_access_YN":0,"created_by":"4DC8A780","created_datetime":"2020-01-01T12:00:00.000Z","updated_by":"DEF","updated_datetime":"2020-01-01T12:00:00.000Z"}
DELETE: https://api.tourneymaster.org/v1/facilities?<facilities id>
  
#### Members (events.members)
1. GET (all): https://api.tourneymaster.org/v1/members
