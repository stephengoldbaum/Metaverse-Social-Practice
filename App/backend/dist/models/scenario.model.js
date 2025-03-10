"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const scenarioSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mediaType: {
        type: String,
        enum: ['VR', 'web', 'mobile'],
        required: true,
    }
}, {
    timestamps: true,
});
exports.ScenarioModel = mongoose_1.default.model('Scenario', scenarioSchema);
