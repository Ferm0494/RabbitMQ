const express = require('express')
const app = express()
const USERS_QUEUE= 'LVL_UP_USERS';
const PORT = process.env.PORT || 5000
const {startRabbit} = require('../config')




startRabbit().then(async({channel})=>{
    let cont= 0;
    channel.prefetch(1);
    await channel.assertQueue(USERS_QUEUE);
    // CONNECT WITH OTHER QUEUES
    channel.consume(USERS_QUEUE,(message)=>{
        channel.ack(message);
        console.log("Received msg",message.content.toString());
        
         // CALLBACK FOR OPS.
         cont +=1;
        let newMessage = message.content.toString() + "fer" + cont;
      
        
        channel.sendToQueue(message.properties.replyTo,Buffer.from(newMessage),{
            correlationId: message.properties.correlationId
        });
        
    });
})

