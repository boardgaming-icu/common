"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const node_events_1 = __importDefault(require("node:events"));
class KafkaHandler extends node_events_1.default {
    constructor(config, loggers) {
        super();
        this._config = config;
        this._kafka = new kafkajs_1.Kafka({
            clientId: config.clientId,
            brokers: config.brokers
        });
        this._loggers = loggers;
        this._consumer = this._kafka.consumer({
            groupId: config.groupId,
            maxWaitTimeInMs: 60000,
            allowAutoTopicCreation: true
        });
        this._setupConsumer();
        this._producer = this._kafka.producer({ allowAutoTopicCreation: true });
        this._setupProducer();
    }
    _prehandleKafkaMessage(kafkaPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._handleKafkaMessage(kafkaPayload.message, kafkaPayload.topic);
        });
    }
    _handleKafkaMessage(message, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                try {
                    const msg_obj = JSON.parse(message.value.toString());
                    let reply_func = this._reply(msg_obj.id, topic, resolve);
                    this.emit(msg_obj.op, msg_obj, reply_func);
                }
                catch (err) {
                    (_a = this._loggers) === null || _a === void 0 ? void 0 : _a.error(err);
                    reject();
                }
            });
        });
    }
    _reply(reply_id, topic, resolve) {
        return (op, data) => __awaiter(this, void 0, void 0, function* () {
            resolve();
            this._producer.send({
                topic,
                messages: [
                    { value: JSON.stringify({
                            op,
                            reply_id,
                            data
                        }) }
                ]
            });
        });
    }
    _setupProducer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._producer.connect();
        });
    }
    _setupConsumer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._consumer.connect();
            yield this._consumer.subscribe({ topics: this._config.topics });
            yield this._consumer.run({
                eachMessage: this._prehandleKafkaMessage
            });
        });
    }
}
exports.default = KafkaHandler;
