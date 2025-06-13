export function setChildNodesValues({
  child,
  storeValue,
  inverted,
  skipped,
  node,
}) {
  const cNode = node.find((d) => d.index === child.index);
  cNode.store = storeValue;
  cNode.inverted = inverted;
  cNode.skipped = skipped;
}
