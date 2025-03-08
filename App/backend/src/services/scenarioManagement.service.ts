import { v4 as uuidv4 } from 'uuid';
import { ScenarioModel } from '../models/scenario.model';
import { Scenario, PaginatedResponse, ScenarioFilter, ScenarioSort } from '../types';


export class ScenarioManagementService {
  async registerScenario(data: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scenario> {
    const id = uuidv4();
    
    const scenario = await ScenarioModel.create({
      id,
      ...data
    });

    return this.mapScenario(scenario);
  }

  async getScenario(id: string): Promise<Scenario | null> {
    const scenario = await ScenarioModel.findOne({ id });
    
    if (!scenario) {
      return null;
    }

    return this.mapScenario(scenario);
  }

  async listScenarios(
    filter?: ScenarioFilter,
    sort?: ScenarioSort,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Scenario>> {
    // Build filter query
    const query: any = {};
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
    const sortQuery: any = {};
    if (sort) {
      sortQuery[sort.field] = sort.direction === 'asc' ? 1 : -1;
    } else {
      // Default sort by createdAt desc
      sortQuery.createdAt = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    // Execute queries
    const [scenarios, total] = await Promise.all([
      ScenarioModel.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      ScenarioModel.countDocuments(query)
    ]);

    return {
      items: scenarios.map(this.mapScenario),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  private mapScenario(scenario: any): Scenario {
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
