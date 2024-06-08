import { Consumer, EachMessagePayload, Kafka, KafkaMessage, Producer } from "kafkajs";
import EventEmitter from 'node:events';
export type KafkaConfig = {
    brokers: string[],
    topics: string[],
    groupId: string,
    clientId: string
}

export type KafkaLoggers = {
    info?: Function,
    error?: Function
}

export default class KafkaHandler extends EventEmitter {
    private _kafka: Kafka
    private _producer: Producer
    private _consumer: Consumer
    private _config: KafkaConfig
    private _loggers?: KafkaLoggers
    constructor(config: KafkaConfig, loggers?: KafkaLoggers) {
        super()
        this._config = config
        this._kafka = new Kafka({
            clientId: config.clientId,
            brokers: config.brokers
        })
        this._loggers = loggers

        this._consumer = this._kafka.consumer({ 
            groupId: config.groupId, 
            maxWaitTimeInMs: 60000, 
            allowAutoTopicCreation: true 
        })
        this._setupConsumer()
        this._producer = this._kafka.producer({ allowAutoTopicCreation: true })
        this._setupProducer()
    }

    async _prehandleKafkaMessage(kafkaPayload: EachMessagePayload) {
        return await this._handleKafkaMessage(kafkaPayload.message, kafkaPayload.topic)
    }

    async _handleKafkaMessage(message: KafkaMessage, topic: string): Promise<void> {
        return new Promise((resolve,reject) => {
            try {
                const msg_obj = JSON.parse(message.value.toString())
                let reply_func = this._reply(msg_obj.id, topic, resolve)
                this.emit(msg_obj.op, msg_obj, reply_func)    
            } catch (err) {
                this._loggers?.error(err)
                reject()
            }
        })
    }
    _reply(reply_id: string, topic: string, resolve: Function) {
        return async (op: string, data: object) => {
            resolve()
            this._producer.send({
                topic,
                messages: [
                    {value: JSON.stringify({
                        op,
                        reply_id,
                        data
                    })}
                ]
            })
        }
    }
    async _setupProducer() {
        await this._producer.connect()
    }
    async _setupConsumer() {
        await this._consumer.connect()
        await this._consumer.subscribe({topics: this._config.topics})
        await this._consumer.run({
            eachMessage: this._prehandleKafkaMessage
        })
    }
}