#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { createPlanFromPrompt } from "./planner";
import { executePlan } from "./executor";


const program = new Command();

program
  .name("traycer-lite")
  .description("A tiny traycer-like planning layer demo (TypeScript)")
  .option("-s, --simulate", "simulate execution only (no filesystem changes)")
  .option("-t, --task <taskDescription>", "task description to plan for")
  .parse(process.argv);

const opts = program.opts();

async function main() {
  let task = opts.task;
  if (!task) {
    const ans = await inquirer.prompt([
      { name: "task", type: "input", message: "Describe the coding task (e.g. 'Add a user login API'):" }
    ]);
    task = ans.task;
  }

  console.log(chalk.bold.green(`\n[Traycer-lite] Creating plan for: "${task}"\n`));
  const plan = createPlanFromPrompt(task);

  console.log(chalk.yellow("Generated Plan:"));
  plan.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title} — ${p.type}`);
    console.log(`     > ${p.detail}`);
  });

  const mode = opts.simulate ? "simulate" : "execute";
  console.log(chalk.cyan(`\nRunning plan in mode: ${mode}\n`));
  const res = await executePlan(plan, !!opts.simulate ? false : true);

  console.log(chalk.magenta(`\nPlan results summary:`));
  res.forEach(r => {
    console.log(`- ${r.stepId}: ${r.ok ? chalk.green("ok") : chalk.red("failed")} — ${r.message}`);
  });

  console.log(chalk.gray("\nDone."));
}

main().catch(e => {
  console.error("Fatal:", e);
});

;

