import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import ScenarioForm from "~/components/ScenarioForm";
import { scenarioApi } from "~/utils/api";
import type { ScenarioInput } from "~/types/scenario";

type ActionData = {
  errors?: {
    name?: string;
    description?: string;
    mediaType?: string;
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
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

  try {
    // Call the actual API
    await scenarioApi.createScenario({
      name: name as string,
      description: description as string,
      mediaType: mediaType as 'VR' | 'web' | 'mobile',
    });
    
    return redirect("/scenarios");
  } catch (error) {
    console.error("Error creating scenario:", error);
    return redirect("/scenarios");
  }
};

export default function NewScenario() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Scenario</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <ScenarioForm errors={actionData?.errors} />
      </div>
    </div>
  );
}
