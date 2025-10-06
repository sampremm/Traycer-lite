export type PlanStep = {
  id: string;
  title: string;
  type: "code" | "shell" | "test" | "doc" | "other";
  metadata?: Record<string, any>;
  detail: string;
};

export function createPlanFromPrompt(prompt: string): PlanStep[] {
  // Simple heuristic: produce a 3–5 step plan from the prompt.
  // In a real Traycer, this would be an LLM call that returns structured plan.
  const normalized = prompt.trim();

  // Base plan structure
  const plan: PlanStep[] = [];

  plan.push({
    id: "plan-1",
    title: "Define interfaces & files",
    type: "doc",
    detail: `Create basic file structure and interfaces for: "${normalized}".`
  });

  plan.push({
    id: "plan-2",
    title: "Implement core code",
    type: "code",
    metadata: { filename: `src/${slug(normalized)}.ts` },
    detail: `Implement a minimal code stub for: "${normalized}".`
  });

  plan.push({
    id: "plan-3",
    title: "Add tests",
    type: "test",
    metadata: { testFile: `tests/${slug(normalized)}.test.ts` },
    detail: `Add a simple test to verify the implemented behavior.`
  });

  plan.push({
    id: "plan-4",
    title: "Run tests & lint",
    type: "shell",
    detail: `Run the project's test command and report the result.`
  });

  return plan;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
