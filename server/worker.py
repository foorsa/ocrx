import sys
from rq import Queue, Worker, Connection
import redis
import multiprocessing

# Establish a connection to Redis
conn = redis.Redis(host="localhost", port=6379, db=0)

if __name__ == "__main__":
    with Connection(conn):
        # Create a Queue object
        queue = Queue(connection=conn)

        # Create a Worker object
        worker = Worker([queue], connection=conn)

        # Start the worker using spawn method
        multiprocessing.set_start_method("spawn")
        worker.work(
            burst=False,
            logging_level="INFO",
        )
