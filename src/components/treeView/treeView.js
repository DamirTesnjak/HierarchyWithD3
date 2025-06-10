import { hierarchy, select } from "d3";
import { useRef, useEffect } from "react";

export function TreeView() {
  const data = {
    Hierarchy: [
      {
        Q3: [
          {
            Jul: 113.4,
          },
          {
            Aug: 46.4,
          },
          {
            Sep: 42.7,
          },
        ],
      },
      {
        Q4: [
          {
            Oct: 115.5,
          },
          {
            Nov: 24.8,
          },
          {
            Dec: 97.2,
          },
        ],
      },
    ],
  };

  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);

    // Clear previous drawing
    svg.selectAll("*").remove();

    // Example: draw a hierarchical structure
    const tranformedData = transformData(data);
    console.log("transformedData", tranformedData);
    drawHierarchicalStructure(tranformedData, svg);
  }, [data]);

  function transformData(obj, keyName = "hierarchy") {
    // for object we get entries [key, value]
    const entries = Object.entries(obj);

    if (!Array.isArray(entries[0][1])) {
      // check if object value is an array object
      const keyValue = Object.entries(entries[0][1]); // object value

      // returning { name: "object key", value: "object value" },
      // the strcture of data to be compatible with d3.hierarchy()
      return { name: keyValue[0][0], value: keyValue[0][1] };
    }

    const name = entries[0][0]; // object key from entries [key, value]
    const children = entries[0][1].map((child) => {
      // set children value as an array, with recursive logic for arbitrary depth
      const childEntries = Object.entries(child);

      if (Array.isArray(childEntries[0][1])) {
        return {
          name: childEntries[0][0],
          children: [
            childEntries[0][1].map(() => transformData(childEntries[0][1])),
          ],
        };
      }
      return null;
    });

    // returning the strcture of data to be compatible with d3.hierarchy()
    return {
      name,
      children,
    };
  }

  function drawHierarchicalStructure(data, svg) {
    const nodeSize = 20;
    const root = hierarchy(data);
    const nodes = root.descendants();
    const width = 1000;
    const height = (nodes.length + 1) * nodeSize;

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "grey");

    const node = select("rect").selectAll("g").data(nodes).enter().append("g");

    node
      .selectAll("circle")
      .attr("cx", (d) => d.depth * nodeSize)
      .attr("r", 2.5)
      .attr("fill", (d) => (d.children ? null : "#999"));

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + 6)
      .text((d) => `${d.data.name} ${d.data.value}`);
  }

  return <svg ref={svgRef}></svg>;
}
