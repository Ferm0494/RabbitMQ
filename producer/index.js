const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
const generateUniqueId = require('generate-unique-id');
const {startRabbit} = require('../config')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
// 
app.post('/producer/users', async(req,res)=>{
    try{
    let id = generateUniqueId();
    console.log("Unique ID for API!",id);
    const USERS_QUEUE= 'LVL_UP_USERS';
    const USERS_QUEUE_RESULT = 'LVL_UP_USERS_RESULT'
    const {channel,connection}= await startRabbit();
    await channel.assertQueue(USERS_QUEUE);
    await channel.assertQueue(USERS_QUEUE_RESULT);
    const msg = {
        id,
        text: "Hello World!"
    };

    channel.sendToQueue(
        USERS_QUEUE,
        Buffer.from(JSON.stringify(msg)),
        {
            correlationId: id,
            replyTo: USERS_QUEUE_RESULT,
        }
    )

    channel.consume(USERS_QUEUE_RESULT,(msg)=>{
       
        if(msg.properties.correlationId === id){
            channel.ack(msg);
            connection.close();
            res.json({success:true, msg: msg.content.toString()});

        }
    })
        
      
    }catch(error){
        res.json({success:false, error})
    }
})
 
app.listen(PORT,()=>{
    console.log('Listening on port ',PORT)
})