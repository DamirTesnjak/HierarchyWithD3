import { hierarchy, select } from "d3";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { transformData } from "../../utils/transformData";
import { getSumValueOfNode } from "../../utils/getSumValueOfNode";
import { valueTextPosition } from "../../utils/valueTextPosition";
import { fontColor } from "../../utils/fontColor";
import { onClickNode } from "../../utils/onClickNode";
import Toolbar from "../Toolbar";
import jsonData from "../../data/random_nested_tree_10000_leaves";

export function TreeView() {
  const data = useMemo(() => jsonData, []);

  const drawHierarchicalStructure = useCallback((data, svg) => {
    const nodeSize = 25;
    const root = hierarchy(data).eachBefore(
      // for each node and decendandt in pre-order traversal we add am index value,
      // starting with the 0
      ((i) => (d) => {
        d.index = i++;
        d.collapsed = false;
        d.store = d.data.value; // store the values for leaves
        d.inverted = false; // tag if value is inverted
        d.skipped = false; // tag if value is skipped
        d.dirty = false; // tag if value in node or leave is changed
      })(0)
    );
    const nodes = root.descendants();

    const width = 250;
    const labelWidth = 50;
    const height = nodes.length * nodeSize;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-10, -15, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 15px sans-serif;");

    const node = svg
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(0,${d.index * nodeSize})`)
      .on("click", function (e, d) {
        onClickNode({ d, actionRef, labelWidth, root, group: svg });
      });

    node
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", (d) => (d.children ? "black" : "#999"));

    node // display label
      .append("text")
      .attr("class", "label")
      .attr("dy", "0.32em")
      .attr("x", (d) => 10 * (d.depth > 0 ? d.depth : 1))
      .attr("fill", (d) => fontColor(d))
      .attr("font-weight", (d) => (d.children ? "bold" : "normal"))
      .text((d) => d.data.name);

    node // display value
      .append("text")
      .attr("class", "value")
      .attr("dy", "0.32em")
      .attr("x", (d) => valueTextPosition(d, labelWidth))
      .attr("fill", (d) => fontColor(d))
      .attr("font-weight", (d) => (d.children ? "bold" : "normal"))
      .text((d) => getSumValueOfNode(d).toFixed(2));

    const bbox = node.node().getBBox();

    node
      .insert("rect", ":first-child")
      .attr("x", bbox.x - 5)
      .attr("y", bbox.y - 4)
      .attr("width", width)
      .attr("height", nodeSize)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#ccc");
  }, []);

  const svgRef = useRef();
  const actionRef = useRef({ skip: false, invert: false });

  useEffect(() => {
    const svg = select(svgRef.current);

    // Clear previous drawing when outside data changes
    svg.selectAll("*").remove();

    const tranformedData = transformData(data);

    // draw a hierarchical structure
    drawHierarchicalStructure(tranformedData, svg);
  }, [data, drawHierarchicalStructure]);

  const toolbarProps = {
    skip: {
      buttonType: "button",
      action: () =>
        (actionRef.current = { invert: false, skip: !actionRef.current.skip }),
    },
    invert: {
      buttonType: "button",
      action: () =>
        (actionRef.current = {
          skip: false,
          invert: !actionRef.current.invert,
        }),
    },
  };

  return (
    <div
      style={{
        marginTop: 10,
      }}
    >
      <Toolbar toolbarProps={toolbarProps} actionStatuses={actionRef.current} />
      <div
        style={{
          marginTop: 10,
          height: 500,
          overflow: "auto",
        }}
      >
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
