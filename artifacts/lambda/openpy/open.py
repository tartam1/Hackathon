import json
import uuid
import requests


def lambda_handler(event, context):
    

    # Set the request parameters
    url = 'https://dev36823.service-now.com/api/now/table/incident'
    user = 'admin'
    pwd = 'VYfbTzwO4t8C'

        # Set proper headers
    headers = {"Content-Type":"application/json","Accept":"application/json"}

    # Do the HTTP request
    response = requests.post(url, auth=(user, pwd), headers=headers ,data="{\"assigned_to\":\"\",\"active\":\"\",\"business_service\":\"\",\"opened_by\":\"\"}")

    # Check for HTTP codes other than 200
    if response.status_code != 200: 
        print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
        #exit()

    # Decode the JSON response into a dictionary and use the data
    data = response.json()
    print(data)
    
    return {
        "statusCode": 200,
        "ticketNumber": str(uuid.uuid1())
    }