const {createProducer, sendMessage} = require('./kafkaClient');
const {
    KAFKA_CLIENT_ID='default_client',
    KAFKA_BROKERS=[]
} = require('./getConfig').getCombinedConfig()

module.exports = ({topic=`topic_${Date.now()}`}) => {
    try {   
        console.log(`@@ kafkaSender required : ${topic}`);
        const send = async ({key='none', messageJson}) => {
            console.log(`@@ kafkaSender send called : ${messageJson}`);
            try {
                const producer = createProducer({
                    clientId: KAFKA_CLIENT_ID,
                    brokers: KAFKA_BROKERS
                });

                const {type, source, name, value} = messageJson;
                console.log(producer)
                console.log(`@@ notify report : type[${type}] source[${source}] name[${name}] value[${value}]`);
                const payloads = {
                    topic,
                    messages: [{
                        key,
                        value:JSON.stringify(messageJson)
                    }]
                }
                const result = await sendMessage(producer, payloads);
                producer.disconnect();
            } catch (err) {
                console.error(err);
                producer.disconnect();   
            }

        }
        return {
            send
        }
    } catch (err) {
        console.error(err);
        return {
            send:()=>{}
        }
    }

}