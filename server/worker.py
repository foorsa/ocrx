import time

# Background Task
def BackgroundTask(T):
    delay = 2
    
    print(f"[...] Task {T} started")
    print(f"[...] Simulating {delay} second delay")
    
    time.sleep(delay)
    
    print(len(T))
    
    print(f"[...] Task {T} finished")
    
    return len(T)