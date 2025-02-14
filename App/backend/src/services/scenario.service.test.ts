import { ScenarioService } from './scenario.service';
import { setupTestDB } from '../test/helpers/db';
import { Scenario } from '../types';

describe('ScenarioService', () => {
  setupTestDB();
  
  let scenarioService: ScenarioService;

  beforeEach(() => {
    scenarioService = new ScenarioService();
  });

  describe('registerScenario', () => {
    it('should create a new scenario', async () => {
      const scenarioData = {
        name: 'Virtual Meeting',
        description: 'A virtual meeting room for remote teams',
        mediaType: 'VR' as const
      };

      const scenario = await scenarioService.registerScenario(scenarioData);

      expect(scenario).toMatchObject({
        ...scenarioData,
        id: expect.any(String)
      });
      expect(scenario.createdAt).toBeInstanceOf(Date);
      expect(scenario.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getScenario', () => {
    it('should return null for non-existent scenario', async () => {
      const scenario = await scenarioService.getScenario('non-existent-id');
      expect(scenario).toBeNull();
    });

    it('should return scenario by id', async () => {
      const scenarioData = {
        name: 'Virtual Meeting',
        description: 'A virtual meeting room for remote teams',
        mediaType: 'VR' as const
      };

      const created = await scenarioService.registerScenario(scenarioData);
      const retrieved = await scenarioService.getScenario(created.id);

      expect(retrieved).toMatchObject(created);
    });
  });

  describe('listScenarios', () => {
    let scenarios: Scenario[];

    beforeEach(async () => {
      // Create test scenarios
      const testData = [
        {
          name: 'Virtual Meeting',
          description: 'A virtual meeting room',
          mediaType: 'VR' as const
        },
        {
          name: 'Web Conference',
          description: 'A web conference room',
          mediaType: 'web' as const
        },
        {
          name: 'Mobile Chat',
          description: 'A mobile chat application',
          mediaType: 'mobile' as const
        }
      ];

      scenarios = await Promise.all(
        testData.map(data => scenarioService.registerScenario(data))
      );
    });

    it('should return paginated results', async () => {
      const result = await scenarioService.listScenarios(undefined, undefined, 1, 2);
      
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    it('should filter by mediaType', async () => {
      const result = await scenarioService.listScenarios({ mediaType: 'VR' });
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0].mediaType).toBe('VR');
    });

    it('should search by name and description', async () => {
      const result = await scenarioService.listScenarios({ search: 'conference' });
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Web Conference');
    });

    it('should sort results', async () => {
      const result = await scenarioService.listScenarios(
        undefined,
        { field: 'name', direction: 'asc' }
      );
      
      expect(result.items.map(s => s.name)).toEqual([
        'Mobile Chat',
        'Virtual Meeting',
        'Web Conference'
      ]);
    });

    it('should combine filter, sort, and pagination', async () => {
      const result = await scenarioService.listScenarios(
        { mediaType: 'web' },
        { field: 'name', direction: 'desc' },
        1,
        1
      );
      
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.items[0].name).toBe('Web Conference');
    });
  });
});
