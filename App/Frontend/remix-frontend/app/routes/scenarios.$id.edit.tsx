import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import ScenarioForm from "~/components/ScenarioForm";
import { scenarioApi } from "~/utils/api";
import type { Scenario, ScenarioInput } from "~/types/scenario";

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

type ActionData = {
  errors?: {
    name?: string;
    description?: string;
    mediaType?: string;
  };
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { id } = params;
  
  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const mediaType = formData.get("mediaType");

  const errors: ActionData["errors"] = {};

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!description || typeof description !== "string" || description.trim().length === 0) {
    errors.description = "Description is required";
  }

  if (!mediaType || typeof mediaType !== "string" || !['VR', 'web', 'mobile'].includes(mediaType)) {
    errors.mediaType = "Valid media type is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  // In a real app, we would call the API
  // const scenario = await scenarioApi.updateScenario(id, {
  //   name: name as string,
  //   description: description as string,
  //   mediaType: mediaType as 'VR' | 'web' | 'mobile',
  // });

  // For now, just redirect to the scenario detail
  return redirect(`/scenarios/${id}`);
};

export default function EditScenario() {
  const { scenario } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Scenario</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <ScenarioForm scenario={scenario} errors={actionData?.errors} />
      </div>
    </div>
  );
}
