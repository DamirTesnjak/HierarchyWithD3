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
    drawHierarchicalStructure(tranformedData, svg);
  }, [data]);

  function transformData(obj, keyName = "hierarchy") {
    if (typeof obj !== "object" || obj === null) {
      return { name: keyName, value: obj };
    }

    const children = Object.entries(obj).map(([keyName, value]) =>
      transformData(value, keyName)
    );

    return {
      name: keyName,
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

    console.log("nodes", nodes);
    console.log("root", root);
  }

  return <svg ref={svgRef}></svg>;
}
