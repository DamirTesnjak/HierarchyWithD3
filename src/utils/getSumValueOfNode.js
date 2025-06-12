export function getSumValueOfNode(d, invert = false) {
  if (d.children) {
    let childrenStoredValues = d
      .leaves()
      .filter((d) => d.store)
      .map((d) => d.store);

    console.log("childrenStoredValues1", childrenStoredValues);

    let sumChildren = childrenStoredValues.reduce((acc, curr) => acc + curr, 0);

    /*function initialValue() {
      if (d.sumStore && invert) {
        return d.sumStore;
      }
      return 0;
    }*/

    if (!invert || sumChildren === 0) {
      d.sumStore = sumChildren;
    }
    console.log("sumChildren", sumChildren);

    return sumChildren;
  }
  return d.data.value;
}
