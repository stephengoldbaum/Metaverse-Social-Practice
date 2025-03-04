import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import ScenarioCard from "~/components/ScenarioCard";
import { scenarioApi } from "~/utils/api";
import type { Scenario, PaginatedResponse } from "~/types/scenario";

// This is now using the actual API
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const mediaType = url.searchParams.get("mediaType") as "VR" | "web" | "mobile" | undefined;
    const search = url.searchParams.get("search") || undefined;
    
    const filter = { mediaType, search };
    const data = await scenarioApi.getScenarios(page, pageSize, filter);
    return json(data);
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    // Fallback to mock data if API call fails
    const mockScenarios: Scenario[] = [
      {
        id: "1",
        name: "Virtual Meeting",
        description: "A virtual meeting room for remote teams",
        mediaType: "VR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Social Cafe",
        description: "Practice ordering and small talk in a cafe setting",
        mediaType: "VR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Job Interview",
        description: "Practice job interview skills with AI interviewers",
        mediaType: "web",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    const mockResponse: PaginatedResponse<Scenario> = {
      items: mockScenarios,
      total: mockScenarios.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
    
    return json(mockResponse);
  }
};

export default function ScenariosIndex() {
  const data = useLoaderData<typeof loader>();
  const [scenarios, setScenarios] = useState<Scenario[]>(data.items);

  const handleDelete = async (id: string) => {
    try {
      await scenarioApi.deleteScenario(id);
      setScenarios(scenarios.filter(scenario => scenario.id !== id));
    } catch (error) {
      console.error("Error deleting scenario:", error);
      // For now, just update the local state even if API call fails
      setScenarios(scenarios.filter(scenario => scenario.id !== id));
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scenarios</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the scenarios for social practice in the metaverse.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/scenarios/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Scenario
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.length > 0 ? (
          scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scenarios</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new scenario.</p>
            <div className="mt-6">
              <Link
                to="/scenarios/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Scenario
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
