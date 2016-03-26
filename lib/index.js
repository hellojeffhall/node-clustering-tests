"use strict" ;

const cluster   = require('cluster')          ;
const http      = require('http')             ;
const NUM_CPU   = require('os').cpus().length ;
const HTTP_PORT = 8080                        ;

var multiCall = ( fn, times ) => {
  fn    = fn    || ()=>{} ;
  times = times || 0 ;

  for( let i = 0 ; i < times ; i ++ ) {
    fn();
  } 
};

var createMainServer = params_obj => {
  http.createServer( (request, response) => {

    response.end( params_obj.responseText ) ;

    if( request.url === "/" ) {
      process.exit();
    }

  }).listen(HTTP_PORT);
};

var main = ()=> {
  if( cluster.isMaster ) {
    console.log("Starting master.");

    var getNumberOfRunningServers = function(){
      return Object.keys(cluster.workers).length ;
    };

    cluster.on( 'online' , (worker) => {
      console.log( "# of servers running: " + getNumberOfRunningServers() ) ; 
    });

    cluster.on( 'exit' , (worker) => {
      console.log( "# of servers running: " + getNumberOfRunningServers() ) ; 
      cluster.fork() ;
    });
  
    multiCall( cluster.fork , NUM_CPU ) ; 

  }
  else{  
    createMainServer({
      responseText : ("This response brought to you by PID #" + cluster.worker.process.pid ) 
    }) 
  }
};

module.exports = { run : main } ;
