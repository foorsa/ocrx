from rq import Queue, Worker, Connection
import redis
import multiprocessing

# Establish a connection to Redis

# Development
# conn = redis.Redis(host="localhost", port=6379, db=0)

# Production
conn = redis.Redis(
    host="eu1-brave-turtle-39167.upstash.io",
    port=39167,
    password="e2fd377feafd4c67bb674bfc06efae0c",
    ssl=True,
    ssl_cert_reqs="CERT_REQUIRED",
)


if __name__ == "__main__":
    with Connection(conn):
        # Create a Queue object
        queue = Queue(connection=conn)

        # Create a Worker object
        worker = Worker([queue], connection=conn)

        # Start the worker using spawn method
        multiprocessing.set_start_method("spawn")
        worker.work(burst=False, logging_level="INFO")
