import KafkaHandler from "./communicationHandler.js";
import Logger, { severities, Severities } from "./logger.js";

export default {
    KafkaHandler,
    Logger,
    log_severities: {
        Severities,
        severities
    }
}