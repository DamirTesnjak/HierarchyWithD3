import { hierarchy, select } from "d3";
import { useRef, useEffect, useCallback, useMemo } from "react";

import { transformData } from "../../utils/transformData";
import { getSumValueOfNode } from "../../utils/getSumValueOfNode";
import { valueTextPosition } from "../../utils/valueTextPosition";
import { fontColor } from "../../utils/fontColor";
import { onClickNode } from "../../utils/onClickNode";
import { displayContextMenu } from "../../utils/displayContextMenu";

import Toolbar from "../Toolbar/Toolbar";
import jsonData from "../../data/random_nested_tree_10000_leaves.json";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { INode } from "./type";

export function TreeView() {
  const data = useMemo(
    () => (jsonData /*{
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
                  "01": 115.5,
                },
                {
                  "02": 24.8,
                },
                {
                  "03": [
                    {
                      "01:00": 115.5,
                    },
                    {
                      "02:00": 24.8,
                    },
                    {
                      "03:00": 97.2,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }*/),
    []
  );
  const drawHierarchicalStructure = useCallback((data: any, svg: any) => {
    const nodeSize = 25;
    const root = hierarchy(data).eachBefore(
      ((i) => (d) => {
        const dn = d as INode;
        dn.index = i++;
        dn.store = d.data.value; // store the values for descendants
        dn.inverted = false; // tag if value is inverted
        dn.skipped = false; // tag if value is skipped
        dn.dirty = false; // tag if value in node or leave is changed
        dn.fontSize = "13px";
        dn.fontBold = d.children ? true : false;
        dn.fontItalic = false;
        dn.fontColor = "#000";
      })(0)
    );
    const nodes = root.descendants();

    const width = 250;
    const height = nodes.length * nodeSize;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-10, -15, width, height])
      .attr("style", "max-width: 100%; height: auto; font-family: Roboto");

    const group = svg
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", (d: INode) => `translate(0,${d.index * nodeSize})`)
      .style("cursor", "pointer")
      .on("click", function (e: any, d: INode) {
        const mainRoot = root as INode
        onClickNode({
          d,
          actionRef,
          root: mainRoot,
          group: svg,
          checkChildren: d.children ? true : false,
        });
      })
      .on("contextmenu", function (e: any, d: INode) {
        const mainRoot = root as INode
        displayContextMenu(e, { d, actionRef, root: mainRoot, group: svg });
      });

    group
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", (d: INode) => (d.children ? "black" : "#999"));

    group // display label
      .append("text")
      .attr("class", "label")
      .attr("dy", "0.32em")
      .attr("x", (d: INode) => 10 * (d.depth > 0 ? d.depth : 1))
      .attr("fill", (d: INode) => fontColor(d))
      .attr("font-weight", (d: INode) => (d.children ? "bold" : "normal"))
      .attr("font-size", (d: INode) => d.fontSize)
      .attr("font-style", (d: INode) => (d.fontItalic ? "italic" : "normal"))
      .text((d: INode) => d.data.name);

    group // display value
      .append("text")
      .attr("class", "value")
      .attr("dy", "0.32em")
      .attr("x", (d: INode) => valueTextPosition(d))
      .attr("fill", (d: INode) => fontColor(d))
      .attr("font-weight", (d: INode) => (d.children ? "bold" : "normal"))
      .attr("font-size", (d: INode) => d.fontSize)
      .attr("font-style", (d: INode) => (d.fontItalic ? "italic" : "normal"))
      .text((d: INode) => getSumValueOfNode(d).toFixed(2));

    const bbox = group.node().getBBox();

    group
      .insert("rect", ":first-child")
      .attr("x", bbox.x - 5)
      .attr("y", bbox.y - 4)
      .attr("width", width)
      .attr("height", nodeSize)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#ccc");
  }, []);

  const svgRef = useRef(null);
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
      action: () =>
        (actionRef.current = { invert: false, skip: !actionRef.current.skip }),
    },
    invert: {
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
      <Toolbar toolbarProps={toolbarProps} />
      <ContextMenu />
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
