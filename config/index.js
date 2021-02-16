const amqp = require('amqplib');

const startRabbit=async()=>{
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    return {connection,channel}

}

module.exports={
    startRabbit,
}


