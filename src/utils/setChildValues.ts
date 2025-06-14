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

  const dn = node.find((d) => d.index === child.index)!;
  dn.store = storeValue;
  dn.inverted = inverted;
  dn.skipped = skipped;
  dn.dirty = dirty;
}
