import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from time import sleep

username = quote_plus("yassinechettouch")
password = quote_plus("0tr7$F1m!@OCRX")
cluster = "ocrx-db.rpxyaec.mongodb.net"

uri = (
    "mongodb+srv://"
    + username
    + ":"
    + password
    + "@"
    + cluster
    + "/?retryWrites=true&w=majority"
)

# Maximum number of retries
max_retries = 5
retry_count = 0

while retry_count < max_retries:
    try:
        client = MongoClient(uri, server_api=ServerApi("1"))
        db = client.get_database("OCRX-db")
        break  # Connection successful, break out of the loop
    except pymongo.errors.ServerSelectionTimeoutError:
        # Retry the connection after a short delay
        sleep(2)
        retry_count += 1
else:
    # Maximum number of retries reached, raise an exception or handle the error.
    raise Exception("Failed to connect to MongoDB after multiple attempts.")

    # Continue with your MongoDB operations using the 'db' object.

    # Check if the connection is successful

print("Connection Successful")
print("Collections: ", db.list_collection_names())
