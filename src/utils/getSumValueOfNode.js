export function getSumValueOfNode(d, invert = false) {
  console.log("d", d);
  if (d.children) {
    const childrenStoredValues = d
      .descendants()
      .filter((d) => (invert ? d.store < 0 : d.store))
      .map((d) => d.store);
    console.log("childrenStoredValues", childrenStoredValues);
    const sumChildren = childrenStoredValues.reduce(
      (acc, curr) => acc + curr,
      d.sumStore && invert ? d.sumStore : 0
    );

    if (!invert) {
      d.sumStore = sumChildren;
    }

    return sumChildren;
  }
  return d.data.value;
}
