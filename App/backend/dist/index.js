"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const scenario_routes_1 = require("./routes/scenario.routes");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', scenario_routes_1.scenarioRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});
const startServer = async () => {
    try {
        // Start in-memory MongoDB server
        const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        console.log('Connecting to in-memory MongoDB...');
        await mongoose_1.default.connect(mongoUri);
        console.log('Connected to in-memory MongoDB successfully');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Using in-memory MongoDB for development`);
        });
        // Clean up on process termination
        process.on('SIGTERM', async () => {
            await mongoose_1.default.disconnect();
            await mongoServer.stop();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
