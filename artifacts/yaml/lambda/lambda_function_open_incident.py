import json
import uuid

def lambda_handler(event, context):
    
    #Call ServiceNow API here
    
    # TODO implement
    return {
        "statusCode": 200,
        "ticketNumber": str(uuid.uuid1())
    }