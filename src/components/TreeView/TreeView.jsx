import { hierarchy, select, selectAll } from "d3";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { transformData } from "../../utils/transformData";
import Toolbar from "../Toolbar";

export function TreeView() {
  const data = useMemo(
    () => ({
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
              Dec: [
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
        },
      ],
    }),
    []
  );

  const [action, setAction] = useState({
    skip: false,
    invert: false,
  });

  const drawHierarchicalStructure = useCallback(
    (data, svg) => {
      const nodeSize = 20;
      const root = hierarchy(data).eachBefore(
        // for each node and decendandt in pre-order traversal we add am index value,
        // starting with the 0
        ((i) => (d) => {
          d.index = i++;
          d.skip = false;
          d.invert = false;
          d.collapsed = false;
        })(0)
      );
      const nodes = root.descendants();

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
        .attr("transform", (d) => `translate(0,${d.index * nodeSize})`)
        .on("click", function (e, d) {
          d.skip = action.skip;
          d.invert = action.invert;

          select(this)
            .selectAll("text")
            .style("text-decoration", (d) => {
              console.log("d", d);
              return d.skip ? "line-through" : "none";
            });
        });

      node
        .append("circle")
        .attr("cx", (d) => nodeSize)
        .attr("r", 2.5)
        .attr("fill", (d) => (d.children ? null : "#999"));

      node // display label
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", (d) => d.depth * nodeSize + 6)
        .text((d) => d.data.name);

      node // display value
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", (d) => (d.depth * nodeSize + 6) * 2)
        .text((d) => getSumValueOfNode(d));
    },
    [action.invert, action.skip]
  );

  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);

    // Clear previous drawing

    // -- TODO -
    // logic to update only necessary elements not the entire tree!!!
    // svg.selectAll("*").remove();

    // Example: draw a hierarchical structure
    const tranformedData = transformData(data);
    drawHierarchicalStructure(tranformedData, svg);
  }, [data, action, drawHierarchicalStructure]);

  function getSumValueOfNode(d) {
    console.log("d", d);
    if (d.children) {
      d.sum((child) => child.value);
      return d.value;
    }
    return d.data.value;
  }

  const toolbarProps = {
    skip: {
      buttonText: "Skip",
      buttonType: "button",
      action: () => setAction({ invert: false, skip: !action.skip }),
    },
    invert: {
      buttonText: "Invert",
      buttonType: "button",
      action: () => setAction({ skip: false, invert: !action.invert }),
    },
  };

  console.log("action", action);

  return (
    <div style={{ marginTop: 10 }}>
      <Toolbar toolbarProps={toolbarProps} />
      <svg ref={svgRef}></svg>
    </div>
  );
}
