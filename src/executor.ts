import type { PlanStep } from "./planner";
import { type Agent, CodeAgent, DocAgent, TestAgent, ShellAgent, type AgentResult } from "./agent";
import chalk from "chalk";

export async function executePlan(steps: PlanStep[], execute: boolean) {
  // Choose agent based on step.type
  const results: AgentResult[] = [];
  for (const step of steps) {
    console.log(chalk.blueBright(`\n[Planner] Step: ${step.title} (${step.type})`));
    const agent = pickAgent(step.type);
    try {
      const result = await agent.run(step, execute);
      results.push(result);
      if (result.ok) {
        console.log(chalk.green(`  ✓ ${result.message}`));
      } else {
        console.log(chalk.red(`  ✗ ${result.message}`));
      }
    } catch (err: any) {
      console.log(chalk.red(`  ✗ Exception: ${err.message || err}`));
      results.push({ stepId: step.id, ok: false, message: String(err) });
    }
  }
  return results;
}

function pickAgent(type: string): Agent {
  switch (type) {
    case "code":
      return new CodeAgent();
    case "test":
      return new TestAgent();
    case "doc":
      return new DocAgent();
    case "shell":
      return new ShellAgent();
    default:
      return new DocAgent();
  }
}
