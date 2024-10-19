"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genres = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const genreSchema = new mongoose_1.default.Schema({
    genreName: {
        type: String,
    },
    image: {
        type: String,
    },
    customGenre: {
        type: String,
    },
}, { timestamps: true });
const genres = mongoose_1.default.model("genres", genreSchema);
exports.genres = genres;
//# sourceMappingURL=genresModel.js.map