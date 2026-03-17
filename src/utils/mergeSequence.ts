import type { Phase, SubPhase, SequenceOverlay, SequenceModification } from "../types/goss";

/**
 * Deep-clone phases and apply a scenario overlay.
 * Returns a new phases array with scenario annotations merged in.
 * Base sequence.json is never mutated.
 */
export function mergeSequence(
  basPhases: Phase[],
  overlay: SequenceOverlay | null
): Phase[] {
  if (!overlay || overlay.modifications.length === 0) return basPhases;

  // Deep clone
  const phases: Phase[] = JSON.parse(JSON.stringify(basPhases));

  for (const mod of overlay.modifications) {
    applyModification(phases, mod, overlay.moduleLabel);
  }

  return phases;
}

/** Find an item by id across all 3 levels. Returns the item and its parent array. */
function findById(
  phases: Phase[]
): (id: string) => { item: Phase | SubPhase; parent: (Phase | SubPhase)[] } | null {
  return (id: string) => {
    for (const phase of phases) {
      if (phase.id === id) return { item: phase, parent: phases as any };
      for (const sub of phase.subPhases) {
        if (sub.id === id) return { item: sub, parent: phase.subPhases };
        if (sub.subPhases) {
          for (const seg of sub.subPhases) {
            if (seg.id === id) return { item: seg, parent: sub.subPhases };
          }
        }
      }
    }
    return null;
  };
}

function applyModification(
  phases: Phase[],
  mod: SequenceModification,
  moduleLabel: string
): void {
  const find = findById(phases);

  switch (mod.action) {
    case "gate": {
      const found = find(mod.target);
      if (found) {
        const item = found.item as SubPhase;
        item.scenarioGate = mod.gate;
        item.scenarioModule = moduleLabel;
      }
      break;
    }

    case "modify": {
      const found = find(mod.target);
      if (!found) break;
      const item = found.item as SubPhase;
      item.scenarioModule = moduleLabel;
      if (mod.gate) {
        item.scenarioGate = mod.gate;
      }
      if (mod.patch?.appendContent) {
        item.appendedContent = mod.patch.appendContent;
      }
      if (mod.patch?.appendNotes) {
        item.appendedNotes = mod.patch.appendNotes;
      }
      break;
    }

    case "add": {
      if (!mod.item) break;
      const newItem: SubPhase = { ...mod.item, scenarioModule: moduleLabel };

      if (mod.insertAfter) {
        const found = find(mod.insertAfter);
        if (found) {
          const arr = found.parent as SubPhase[];
          const idx = arr.indexOf(found.item as SubPhase);
          arr.splice(idx + 1, 0, newItem);
        }
      } else {
        // Find parent by target and prepend
        const found = find(mod.target);
        if (found) {
          const parent = found.item as Phase | SubPhase;
          if ("subPhases" in parent && parent.subPhases) {
            parent.subPhases.unshift(newItem);
          }
        }
      }
      break;
    }

    case "remove": {
      const found = find(mod.target);
      if (found) {
        const arr = found.parent as SubPhase[];
        const idx = arr.indexOf(found.item as SubPhase);
        if (idx >= 0) arr.splice(idx, 1);
      }
      break;
    }
  }
}
