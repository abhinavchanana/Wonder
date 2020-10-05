Have used the IBM Node.js sample application for developement

for running the APP

Node server/server.js

There are 3 api points exposed in the API:

1. Producer API : Inserts into queue
2. Consumer API: Returns the message ID and message
3.Consumer Signal API: The consumer signals the server with message ID to inform the. message broker  a

Refer to Postman collection:
https://documenter.getpostman.com/view/1426757/TVRg8VMu


I have used locks to avoid race condition for consumer andsettimeout to control the timing out situation.

Had developed the code in a hurry hence the documentation.
