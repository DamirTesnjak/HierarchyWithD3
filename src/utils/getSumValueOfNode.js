export function getSumValueOfNode(d, invert = false) {
  if (d.children) {
    let childrenStoredValues = d
      .leaves()
      .filter((d) => d.store)
      .map((d) => d.store);

    const sumChildren = childrenStoredValues.reduce(
      (acc, curr) => acc + curr,
      0
    );

    if (!invert || sumChildren === 0) {
      d.sumStore = sumChildren;
    }

    return sumChildren;
  }
  return d.data.value;
}
