export function transformData(obj, keyName = "hierarchy") {
  // for object we get entries [key, value]
  const entries = Object.entries(obj);

  // check if object value is NOT array object
  if (!Array.isArray(entries[0][1])) {
    // returning { name: "object key", value: "object value" },
    // the strcture of data to be compatible with d3.hierarchy()
    return { name: entries[0][0], value: entries[0][1] };
  }

  const name = entries[0][0]; // object key from entries [key, value]
  const children = entries[0][1].map((child) => {
    // set children value as an array, with recursive logic for arbitrary depth
    const childEntries = Object.entries(child);

    if (Array.isArray(childEntries[0][1])) {
      return {
        name: childEntries[0][0],
        children: childEntries[0][1].map((i) => transformData(i)),
      };
    }
    return {
      name: childEntries[0][0],
      children: childEntries[0][1],
    };
  });

  // returning the strcture of data to be compatible with d3.hierarchy()
  return {
    name,
    children,
  };
}
