import { INode } from "components/TreeView/type";

export function valueTextPosition(d: INode) {
  const siblingLabePositionX = 10 * (d.depth > 0 ? d.depth : 1);
  return 50 + siblingLabePositionX + 10;
}
