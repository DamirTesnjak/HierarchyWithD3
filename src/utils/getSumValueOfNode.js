export function getSumValueOfNode(d, invert = false) {
  if (d.children) {
    const originalValues = d.leaves().map((d) => d.data.value * -2);
    let childrenStoredValues = d
      .leaves()
      .filter((d) => {
        console.log("d", d.inverted);
        if (invert) {
          return d.store < 0;
        }
        if (d.inverted) {
          console.log("d.store", d.store);
          return originalValues.includes(d.store * -2);
        }
        return d.store;
      })
      .map((d) => {
        return d.store;
      });

    console.log("childrenStoredValues1", childrenStoredValues);

    const sumChildren = childrenStoredValues.reduce(
      (acc, curr) => acc + curr,
      initialValue()
    );

    function initialValue() {
      if (d.sumStore && invert) {
        return d.sumStore;
      }
      return 0;
    }

    if (!invert || sumChildren === 0) {
      d.sumStore = sumChildren;
    }
    console.log("sumChildren", sumChildren);

    return sumChildren;
  }
  return d.data.value;
}
