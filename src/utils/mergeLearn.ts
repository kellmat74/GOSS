import type {
  LearnChapter,
  LearnData,
  LearnDecision,
  LearnModification,
  LearnOverlay,
} from "../types/learn";

/**
 * Deep-clone base learn chapters and apply a module overlay.
 * If a specific scenario is selected, also applies scenario-specific overrides.
 * Base data is never mutated. Parallels mergeSequence() for the SoP.
 */
export function mergeLearn(
  base: LearnData,
  overlay: LearnOverlay | null,
  scenario?: string | null,
): LearnChapter[] {
  if (!overlay || overlay.modifications.length === 0) {
    return base.chapters;
  }

  const chapters: LearnChapter[] = JSON.parse(JSON.stringify(base.chapters));

  for (const mod of overlay.modifications) {
    applyModification(chapters, mod, overlay.moduleLabel);
  }

  if (scenario && overlay.scenarioOverrides?.[scenario]) {
    for (const mod of overlay.scenarioOverrides[scenario].modifications) {
      applyModification(chapters, mod, overlay.moduleLabel);
    }
  }

  return chapters;
}

function applyModification(
  chapters: LearnChapter[],
  mod: LearnModification,
  moduleLabel: string,
) {
  const target = findTarget(chapters, mod.target);

  switch (mod.action) {
    case "gate":
      if (target?.kind === "chapter" && mod.gate) {
        target.chapter.scenarioGate = mod.gate;
        target.chapter.scenarioModule = moduleLabel;
      } else if (target?.kind === "decision" && mod.gate) {
        target.decision.scenarioGate = mod.gate;
        target.decision.scenarioModule = moduleLabel;
      }
      break;

    case "modify":
      if (target?.kind === "decision" && mod.patch?.appendBlocks) {
        target.decision.appendedBlocks = [
          ...(target.decision.appendedBlocks ?? []),
          ...mod.patch.appendBlocks,
        ];
        target.decision.scenarioModule = moduleLabel;
      }
      break;

    case "add":
      if (mod.chapter) {
        const idx = mod.insertAfter
          ? chapters.findIndex((c) => c.id === mod.insertAfter)
          : -1;
        const newChapter = { ...mod.chapter, scenarioModule: moduleLabel };
        chapters.splice(idx + 1, 0, newChapter);
      } else if (mod.decision && target?.kind === "chapter") {
        const decisions = target.chapter.decisions;
        const idx = mod.insertAfter
          ? decisions.findIndex((d) => d.id === mod.insertAfter)
          : -1;
        decisions.splice(idx + 1, 0, {
          ...mod.decision,
          scenarioModule: moduleLabel,
        });
      }
      break;

    case "remove":
      if (target?.kind === "chapter") {
        const idx = chapters.findIndex((c) => c.id === target.chapter.id);
        if (idx >= 0) chapters.splice(idx, 1);
      } else if (target?.kind === "decision") {
        const decisions = target.parentChapter.decisions;
        const idx = decisions.findIndex((d) => d.id === target.decision.id);
        if (idx >= 0) decisions.splice(idx, 1);
      }
      break;
  }
}

type TargetResult =
  | { kind: "chapter"; chapter: LearnChapter }
  | { kind: "decision"; decision: LearnDecision; parentChapter: LearnChapter }
  | null;

function findTarget(chapters: LearnChapter[], target: string): TargetResult {
  // "chapterId.decisionId" or just "chapterId"
  const [chapterId, decisionId] = target.split(".");
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  if (!decisionId) return { kind: "chapter", chapter };
  const decision = chapter.decisions.find((d) => d.id === decisionId);
  if (!decision) return null;
  return { kind: "decision", decision, parentChapter: chapter };
}
