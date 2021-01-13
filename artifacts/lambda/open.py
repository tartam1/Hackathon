import json
import uuid

def lambda_handler(event, context):
    

    # Call ServiceNow API here
    
    return {
        "statusCode": 200,
        "ticketNumber": str(uuid.uuid1())
    }