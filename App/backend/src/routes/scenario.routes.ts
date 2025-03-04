import { Router } from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';
import { ScenarioService } from '../services/scenario.service';
import { ScenarioFilter, ScenarioSort } from '../types';


const router = Router();
const scenarioService = new ScenarioService();

const createScenarioSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  mediaType: z.enum(['VR', 'web', 'mobile'])
});

const listScenariosQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  mediaType: z.enum(['VR', 'web', 'mobile']).optional(),
  search: z.string().optional(),
  sortField: z.enum(['name', 'createdAt', 'mediaType']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional()
});

router.post('/scenarios', asyncHandler(async (req, res) => {
  try {
    const data = createScenarioSchema.parse(req.body);
    const scenario = await scenarioService.registerScenario(data);
    res.status(201).json(scenario);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input', errors: error.errors });
    } else {
      throw error;
    }
  }
}));

router.get('/scenarios', asyncHandler(async (req, res) => {
  try {
    const query = listScenariosQuerySchema.parse(req.query);
    
    const filter: ScenarioFilter = {
      mediaType: query.mediaType,
      search: query.search
    };

    const sort: ScenarioSort | undefined = query.sortField ? {
      field: query.sortField,
      direction: query.sortDirection || 'asc'
    } : undefined;

    const scenarios = await scenarioService.listScenarios(
      filter,
      sort,
      query.page || 1,
      query.pageSize || 10
    );

    res.json(scenarios);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid query parameters', errors: error.errors });
    } else {
      throw error;
    }
  }
}));

router.get('/scenarios/:id', asyncHandler(async (req, res) => {
  const scenario = await scenarioService.getScenario(req.params.id);
  if (!scenario) {
    res.status(404).json({ message: 'Scenario not found' });
    return;
  }
  res.json(scenario);
}));

export const scenarioRoutes = router;
