import type { DiagramName } from "../../../types/learn";
import { AdvCascadePipeline } from "./AdvCascadePipeline";

/**
 * Diagram dispatcher — maps a DiagramName from learn.json to its
 * rendering component. Keep diagrams small and registered here.
 */
export function Diagram({ name }: { name: DiagramName }) {
  switch (name) {
    case "adv-cascade-pipeline":
      return <AdvCascadePipeline />;
    default:
      return null;
  }
}
