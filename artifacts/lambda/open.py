import json
import uuid
import requests

# Botocore removed the vendored version of requests: This is a viable workaround.
def lambda_handler(event, context):
    

    # Set the request parameters
    url = 'https://https://dev36823.service-now.com/nav_to.do?uri=%2Fhome.do%3F'
    user = 'admin'
    pwd = 'VYfbTzwO4t8C'
    
    # Set proper headers
    headers = {"Content-Type":"application/json","Accept":"application/json"}
    
    # Do the HTTP request
    response = requests.post(url, auth=(user, pwd), headers=headers ,data='{"short_description":"Test"}')
    
    # Check for HTTP codes other than 200
    if response.status_code != 201: 
        print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
        exit()
    
    # Decode the JSON response into a dictionary and use the data
    print('Status:',response.status_code,'Headers:',response.headers,'Response:',response.json())
    
    return {
        "statusCode": 200,
        "ticketNumber": str(uuid.uuid1())
    }