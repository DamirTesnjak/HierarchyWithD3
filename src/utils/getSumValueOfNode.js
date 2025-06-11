export function getSumValueOfNode(d, invert = false) {
  console.log("d", d);
  if (d.children) {
    const childrenStoredValues = d
      .descendants()
      .filter((d) => d.store)
      .map((d) => d.store);
    console.log("childrenStoredValues", childrenStoredValues);
    const sumChildren = childrenStoredValues.reduce(
      (acc, curr) => acc + curr,
      0
    );

    const sumOfSubsChildren = childrenStoredValues.reduce(
      (acc, curr) => acc + (curr < 0 ? curr : 0),
      sumChildren
    );
    return invert ? sumChildren : sumOfSubsChildren;
  }
  return d.data.value;
}
