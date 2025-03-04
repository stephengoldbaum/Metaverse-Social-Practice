import { Form } from '@remix-run/react';
import type { Scenario, ScenarioInput } from '~/types/scenario';

interface ScenarioFormProps {
  scenario?: Scenario;
  errors?: Record<string, string>;
}

export default function ScenarioForm({ scenario, errors }: ScenarioFormProps) {
  return (
    <Form method="post" className="space-y-6">
      {scenario?.id && <input type="hidden" name="id" value={scenario.id} />}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={scenario?.name}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {errors?.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            defaultValue={scenario?.description}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {errors?.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700">
          Media Type
        </label>
        <div className="mt-1">
          <select
            id="mediaType"
            name="mediaType"
            required
            defaultValue={scenario?.mediaType || 'VR'}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="VR">VR</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        {errors?.mediaType && (
          <p className="mt-2 text-sm text-red-600">{errors.mediaType}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {scenario ? 'Update Scenario' : 'Create Scenario'}
        </button>
      </div>
    </Form>
  );
}
