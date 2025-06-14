import { INode } from "components/TreeView/type";

type IsetChildNodesValues = {
  child: INode;
  storeValue: INode["store"];
  inverted: INode["inverted"];
  skipped: INode["skipped"];
  dirty: INode["dirty"];
  node: INode;
}

export function setChildNodesValues({
  child,
  storeValue,
  inverted,
  skipped,
  dirty,
  node,
}: IsetChildNodesValues) {
  const cNode = node.find((d) => d.index === child.index)!;
  cNode.store = storeValue;
  cNode.inverted = inverted;
  cNode.skipped = skipped;
  cNode.dirty = dirty;
}
