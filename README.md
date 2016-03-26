Just some code while playing around with Node clustering. To run, clone the repo and run with  
```bash
npm test
```
Opening a web browser and navigating to localhost:8080 will end one of the spawned processes, which should then refork. Requesting anything else (e.g., localhost:8080/blah) won't kill the process.
