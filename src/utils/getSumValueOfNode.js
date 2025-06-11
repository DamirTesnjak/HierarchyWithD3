export function getSumValueOfNode(d) {
  if (d.children) {
    const childrenStoredValues = d
      .descendants()
      .filter((d) => d.store)
      .map((d) => d.store);
    const sumChildren = childrenStoredValues.reduce(
      (acc, curr) => acc + curr,
      0
    );
    return sumChildren;
  }
  return d.data.value;
}
