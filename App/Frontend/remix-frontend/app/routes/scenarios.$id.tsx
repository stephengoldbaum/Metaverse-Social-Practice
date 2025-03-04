import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { scenarioApi } from "~/utils/api";
import type { Scenario } from "~/types/scenario";

// Mock data for development
const mockScenarios: Record<string, Scenario> = {
  "1": {
    id: "1",
    name: "Virtual Meeting",
    description: "A virtual meeting room for remote teams",
    mediaType: "VR",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "2": {
    id: "2",
    name: "Social Cafe",
    description: "Practice ordering and small talk in a cafe setting",
    mediaType: "VR",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "3": {
    id: "3",
    name: "Job Interview",
    description: "Practice job interview skills with AI interviewers",
    mediaType: "web",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  if (!id || !mockScenarios[id]) {
    throw new Response("Not Found", { status: 404 });
  }
  
  // In a real app, we would use:
  // const scenario = await scenarioApi.getScenario(id);
  
  return json({ scenario: mockScenarios[id] });
};

export default function ScenarioDetail() {
  const { scenario } = useLoaderData<typeof loader>();

  const getMediaTypeLabel = (type: 'VR' | 'web' | 'mobile') => {
    switch (type) {
      case 'VR':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Virtual Reality
          </span>
        );
      case 'web':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Web
          </span>
        );
      case 'mobile':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Mobile
          </span>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <Link to="/scenarios" className="text-gray-400 hover:text-gray-500">
                  Scenarios
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500">{scenario.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{scenario.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {getMediaTypeLabel(scenario.mediaType)}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/scenarios/${scenario.id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </Link>
            <Link
              to="/scenarios"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to List
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {scenario.description}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Media Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {scenario.mediaType === 'VR' ? 'Virtual Reality' : 
                 scenario.mediaType === 'web' ? 'Web' : 'Mobile'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(scenario.createdAt)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(scenario.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
