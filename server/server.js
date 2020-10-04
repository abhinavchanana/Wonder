// // import dependencies and initialize express
// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');

// const healthRoutes = require('./routes/health-route');
// const swaggerRoutes = require('./routes/swagger-route');

// const app = express();

// // enable parsing of http request body
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // routes and api calls
// app.use('/health', healthRoutes);
// app.use('/swagger', swaggerRoutes);

// // default path to serve up index.html (single page application)
// app.all('', (req, res) => {
//   res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
// });

// // start node server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App UI available http://localhost:${port}`);
//   console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
// });

// // error handler for unmatched routes or api calls
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, '../public', '404.html'));
// });

// module.exports = app;
var timeout = 10000;
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
var express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var app = express();
var queue = [];
var timeoutObj = []
var dead_queue = [];
var dead_queue_id = [];
var Id_array = [];
var get_all_messages =  [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
var cuid = require('cuid');
const { doesNotMatch } = require('assert');
console.log( cuid() );
//Default Handler
app.get('/',function(req,res){
res.send('Producer/Consumer Server');
});


//Producer Handler
app.get('/producer',function(req,res){
res.send('Nothing for Producer Usage /producer/{number}');
})

app.post('/producer',function(req,res){
var producerId = req.body.mssg

if(producerId == "" || producerId.length != 0  ){
    queue.push(producerId);
    message_id =cuid()
    get_all_messages.push({
      key:   message_id,
      value: producerId
  });
    Id_array.push(message_id);
    res.send('Producer Put Mssg and ID was genearted : '+message_id);
}else{
    res.send('Nothing for Producer');
}
});

//Consumer Handler
app.get('/consumer',function(req,res){

  lock.acquire("Consumer", function(done) {
    if(queue.length != 0){
      mssg = queue.shift()
      id = Id_array.shift()
      dead_queue.push(mssg);
      dead_queue_id.push(id);
      console.log(dead_queue);
    done();
    }else{
      res.send('Nothing for Consumer');
  }
}, function(err, ret) {
    // lock released
});
      
  
  lock.acquire(id, function() {
    if(true){
      timeoutObj[id] = setTimeout(function(){ 
      index = dead_queue_id.indexOf(id);
      if(index != -1){
      queue.push(dead_queue[index]);
      Id_array.push(dead_queue_id[index]);
      console.log(dead_queue);
      dead_queue.splice(index,1);
      dead_queue_id.splice(index,1);
      }
         
}, timeout);
    res.json({"Id": id,"message": mssg})
    done();
      // res.send('Consumer Get : '+mssg);  
  }else{
      res.send('Nothing for Consumer');
  }
}, function(err, ret) {
    console.log("Error with locking mechansim" + err);
});



})

app.post('/consumer_signal',function(req,res){
  var msssgId = req.body.id;
  clearTimeout(timeoutObj[msssgId]);
  index = dead_queue_id.indexOf(msssgId);
  dead_queue.splice(index,1);
  dead_queue_id.splice(index,1);
  res.send(msssgId + " Removed from the Queue");
})

app.listen(8084);
