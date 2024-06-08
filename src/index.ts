import KafkaHandler from "./communicationHandler";
import Logger, { severities, Severities } from "./logger";

exports = {
    KafkaHandler,
    Logger,
    log_severities: {
        Severities,
        severities
    }
}