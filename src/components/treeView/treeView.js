import { hierarchy, select } from "d3";
import { useRef, useEffect } from "react";
import { transformData } from "../../utils/transformData";

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

  function drawHierarchicalStructure(data, svg) {
    const nodeSize = 20;
    const root = hierarchy(data).eachBefore(
      // for each node and decendandt in pre-order traversal we add am index value,
      // starting with the 0
      (
        (i) => (d) =>
          (d.index = i++)
      )(0)
    );
    const nodes = root.descendants();

    console.log("nodes", nodes);

    const width = 1000;
    const height = (nodes.length + 2) * nodeSize;

    svg
      .attr("width", width)
      .attr("height", height)
      // .attr("viewBox", [-nodeSize / 2, (-nodeSize * 3) / 2, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; font: 15px sans-serif; overflow: visible;"
      );

    const node = svg
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(0,${d.index * nodeSize})`);

    node
      .append("circle")
      .attr("cx", (d) => nodeSize)
      .attr("r", 2.5)
      .attr("fill", (d) => (d.children ? null : "#999"));

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + 6)
      .text((d) => d.data.name);

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => (d.depth * nodeSize + 6) * 2)
      .text((d) => getSumValueOfNode(d));
  }

  function getSumValueOfNode(d) {
    if (d.children) {
      d.sum((child) => child.value);
      return d.value;
    }
    return d.data.value;
  }

  return (
    <div style={{ marginTop: 10 }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
