"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("../config/config"));
const redis = new ioredis_1.default({
    host: config_1.default.REDIS_HOST,
    port: Number(config_1.default.REDIS_PORT),
    db: 0,
});
exports.default = redis;
//# sourceMappingURL=redis-config.js.map