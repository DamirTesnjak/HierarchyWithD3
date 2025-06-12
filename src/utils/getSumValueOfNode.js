export function getSumValueOfNode(d, invert = false) {
  if (d.children) {
    const childrenStoredValues = d
      .leaves()
      .filter((d) => {
        if (invert) {
          return d.store < 0;
        }
        return d.store >= 0;
      })
      .map((d) => d.store);

    const sumChildren = childrenStoredValues.reduce(
      (acc, curr) => acc + curr,
      d.sumStore && invert ? d.sumStore : 0
    );

    if (!invert || sumChildren === 0) {
      d.sumStore = sumChildren;
    }

    return sumChildren;
  }
  return d.data.value;
}
