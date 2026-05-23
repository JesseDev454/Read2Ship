import { toPng } from "html-to-image";
import { getCompactCurrentDirection } from "./planDisplay";
import type { BuildPlan } from "../types/read2ship";

export function planToMarkdown(plan: BuildPlan): string {
  const tasks = plan.tasks
    .map((task, index) => `${index + 1}. ${task.title} - ${task.description}`)
    .join("\n");

  return `# ${plan.projectTitle}

${plan.summary}

Direction: ${getCompactCurrentDirection(plan)}
Difficulty: ${plan.difficulty}
Estimated time: ${plan.estimatedTime}
Track: ${plan.track}

Stack: ${plan.stack.join(", ")}

Tasks:
${tasks}

Bonus: ${plan.bonusFeature ?? "None"}
`;
}

export async function downloadCard(node: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#0A0A0B",
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
