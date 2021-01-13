import json

def lambda_handler(event, context):
    
    data_dict = {
        'resourceId': event['EvaluateRequestOutput'] ['body']['resourceId'],
        'resourceType': event['EvaluateRequestOutput'] ['body']['resourceType'],
        'tickeID': event['TicketCreationResponse'] ['ticketNumber']
    }

    email_message = "This is an auto generated message from Enterprise Cloud Services. There was an incident related to resource id {resourceId} and resource type {resourceType}. An incident ticket was raised with ticket id {tickeID}. For more information click here.".format(**data_dict)

    print (email_message)
    
    return {
        "statusCode": 200,
        "message" : '{"default": "A message.","email":"'+ email_message + '","subject":"ECS Cloud Incident Notification"}' 
        
    }