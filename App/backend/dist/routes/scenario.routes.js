"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const scenarioManagement_service_1 = require("../services/scenarioManagement.service");
const router = (0, express_1.Router)();
const scenarioService = new scenarioManagement_service_1.ScenarioManagementService();
const createScenarioSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    mediaType: zod_1.z.enum(['VR', 'web', 'mobile'])
});
const listScenariosQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    pageSize: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    mediaType: zod_1.z.enum(['VR', 'web', 'mobile']).optional(),
    search: zod_1.z.string().optional(),
    sortField: zod_1.z.enum(['name', 'createdAt', 'mediaType']).optional(),
    sortDirection: zod_1.z.enum(['asc', 'desc']).optional()
});
router.post('/scenarios', (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const data = createScenarioSchema.parse(req.body);
        const scenario = await scenarioService.registerScenario(data);
        res.status(201).json(scenario);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Invalid input', errors: error.errors });
        }
        else {
            throw error;
        }
    }
}));
router.get('/scenarios', (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const query = listScenariosQuerySchema.parse(req.query);
        const filter = {
            mediaType: query.mediaType,
            search: query.search
        };
        const sort = query.sortField ? {
            field: query.sortField,
            direction: query.sortDirection || 'asc'
        } : undefined;
        const scenarios = await scenarioService.listScenarios(filter, sort, query.page || 1, query.pageSize || 10);
        res.json(scenarios);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Invalid query parameters', errors: error.errors });
        }
        else {
            throw error;
        }
    }
}));
router.get('/scenarios/:id', (0, express_async_handler_1.default)(async (req, res) => {
    const scenario = await scenarioService.getScenario(req.params.id);
    if (!scenario) {
        res.status(404).json({ message: 'Scenario not found' });
        return;
    }
    res.json(scenario);
}));
exports.scenarioRoutes = router;
