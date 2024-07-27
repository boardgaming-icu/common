import KafkaHandler from "./communicationHandler";
import Logger, { severities, Severities } from "./logger";

export default {
    KafkaHandler,
    Logger,
    log_severities: {
        Severities,
        severities
    }
}