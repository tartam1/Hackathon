import requests

def lambda_handler(event=None, context=None):

    # Set the request parameters
    url = 'https://dev36823.service-now.com/api/now/table/incident?sysparm_display_value=true&sysparm_exclude_reference_link=true&sysparm_fields=number%2Copened_by%2Cshort_description%2Cstate%2Cimpact'

    # Username & Password
    user = 'admin'
    pwd = 'VYfbTzwO4t8C'

    # Set proper headers
    headers = {"Content-Type":"application/json","Accept":"application/json"}

    # Do the HTTP request
    response = requests.post(url, auth=(user, pwd), headers=headers ,data="{\"short_description\":\"api test\"}")

    # Check for HTTP codes other than 200
    if response.status_code != 201:
        print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
        exit()

    # Decode the JSON response into a dictionary and use the data
    data = response.json()
    print(data)

    return data

lambda_handler()