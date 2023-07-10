# Import the necessary packages
from flask import Flask, jsonify, request
from worker import BackgroundTask

import time


# Set up the Flask App
app = Flask(__name__)

# Route to the Home Page
@app.route("/Task")
def AddTask():
    # Add the task to the queue
    
    if request.args.get("T"):
        Job = Q.enqueue(BackgroundTask, request.args.get("T"))
        
        QLen = len(Q)
        
        return jsonify(f"Task {Job.id} added to the queue at {Job.enqueued_at}. {QLen} tasks in the queue."), 200
    
    return jsonify("No task provided."), 400


if __name__ == "__main__":
    import redis
    from rq import Queue
    # Setup Redis
    R = redis.Redis(host='localhost', port=6379, db=0)

    # Setup RQ
    Q = Queue(connection=R)
    
    app.run(debug=True)