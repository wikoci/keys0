const cluster = require('cluster')

const numCPU =require('os').cpus().length


if(cluster.isMaster){

    console.log(`\nMaster ${process.pid} is running \n`);
    for(let i=0;i<numCPU;i++){
      cluster.fork()
        //console.log(`Worker ${i+1} started`);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork(); // Create a New Worker, If Worker is Dead
      });
      cluster.on( 'online', function( worker ) {
        console.log( 'Worker ' + worker.process.pid + ' is online.' );
      });

} else {



 require('./index')
} 