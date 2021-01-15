import requests
import json

def lambda_handler(event, context):
    if event['httpMethod'] == 'POST' and event['body']:
        body = {'Result': 'recieved your request', 'msgBody': event['body']}
        response = {'statusCode': 201}
        
        # Set the request parameters
        url = 'https://dev36823.service-now.com/api/now/table/incident?sysparm_display_value=true&sysparm_exclude_reference_link=true&sysparm_fields=number%2Cstate%2Copened_by%2Csys_mod_count%2Cimpact%2Cbusiness_service%2Cpriority%2Copened_at%2Cassignment_group%2Cshort_description%2Cnotify'
    
        # Username & Password
        user = 'admin'
        pwd = 'VYfbTzwO4t8C'
    
        # Set proper headers
        headers = {"Content-Type":"application/json","Accept":"application/json"}
        
        # Test payload
        payload = event['body']
    
        # Do the HTTP request
        response = requests.post(url, auth=(user, pwd), headers=headers, data = json.dumps(payload))
    
        # Check for HTTP codes other than 201
        if response.status_code != 201:
            print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
            exit()
    
        # Decode the JSON response into a dictionary and use the data
        data = response.json()
        #print(data)
        #print(body)

        return data
        