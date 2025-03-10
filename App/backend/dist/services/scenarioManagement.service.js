"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioManagementService = void 0;
const uuid_1 = require("uuid");
const scenario_model_1 = require("../models/scenario.model");
class ScenarioManagementService {
    async registerScenario(data) {
        const id = (0, uuid_1.v4)();
        const scenario = await scenario_model_1.ScenarioModel.create({
            id,
            ...data
        });
        return this.mapScenario(scenario);
    }
    async getScenario(id) {
        const scenario = await scenario_model_1.ScenarioModel.findOne({ id });
        if (!scenario) {
            return null;
        }
        return this.mapScenario(scenario);
    }
    async listScenarios(filter, sort, page = 1, pageSize = 10) {
        // Build filter query
        const query = {};
        if (filter?.mediaType) {
            query.mediaType = filter.mediaType;
        }
        if (filter?.search) {
            query.$or = [
                { name: { $regex: filter.search, $options: 'i' } },
                { description: { $regex: filter.search, $options: 'i' } }
            ];
        }
        // Build sort query
        const sortQuery = {};
        if (sort) {
            sortQuery[sort.field] = sort.direction === 'asc' ? 1 : -1;
        }
        else {
            // Default sort by createdAt desc
            sortQuery.createdAt = -1;
        }
        // Calculate pagination
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        // Execute queries
        const [scenarios, total] = await Promise.all([
            scenario_model_1.ScenarioModel.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(limit),
            scenario_model_1.ScenarioModel.countDocuments(query)
        ]);
        return {
            items: scenarios.map(this.mapScenario),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }
    mapScenario(scenario) {
        return {
            id: scenario.id,
            name: scenario.name,
            description: scenario.description,
            mediaType: scenario.mediaType,
            createdAt: scenario.createdAt,
            updatedAt: scenario.updatedAt
        };
    }
}
exports.ScenarioManagementService = ScenarioManagementService;
