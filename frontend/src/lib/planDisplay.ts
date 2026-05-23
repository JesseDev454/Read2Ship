import type { BuildPlan } from "../types/read2ship";

export function getCompactCurrentDirection(plan: BuildPlan): string {
  const currentDirection = plan.currentDirection.trim();
  if (currentDirection.length <= 56 && !/[.!?]/.test(currentDirection)) {
    return currentDirection;
  }

  const source = `${plan.currentDirection} ${plan.projectTitle} ${plan.summary} ${plan.stack.join(" ")}`.toLowerCase();
  const labels: string[] = [];

  addLabel(labels, source, /\b(ai|agent|agents|openai|gpt|llm)\b/, "AI Agents");
  addLabel(labels, source, /\b(security|secure|audit|auditor|auth|vulnerability|validation|threat)\b/, "Web Security");
  addLabel(labels, source, /\b(automation|workflow|productivity|proactive)\b/, "Developer Automation");
  addLabel(labels, source, /\b(api|backend|node|express|server)\b/, "Backend APIs");
  addLabel(labels, source, /\b(react|frontend|ui|web app|css)\b/, "Frontend Apps");
  addLabel(labels, source, /\b(postgres|postgresql|sql|database)\b/, "Database Tooling");

  if (hasStack(plan, "React") && hasStack(plan, "Node.js")) {
    pushUnique(labels, "React/Node.js");
  } else {
    for (const stackItem of plan.stack.slice(0, 2)) {
      pushUnique(labels, stackItem);
    }
  }

  return labels.slice(0, 3).join(" + ") || currentDirection.split(/[.!?]/)[0].slice(0, 56);
}

function addLabel(labels: string[], source: string, pattern: RegExp, label: string) {
  if (pattern.test(source)) {
    pushUnique(labels, label);
  }
}

function hasStack(plan: BuildPlan, name: string): boolean {
  return plan.stack.some((item) => item.toLowerCase() === name.toLowerCase());
}

function pushUnique(labels: string[], label: string) {
  if (!labels.includes(label)) {
    labels.push(label);
  }
}
