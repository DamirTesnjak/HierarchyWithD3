import { hierarchy, select } from "d3";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { transformData } from "../../utils/transformData";
import { getSumValueOfNode } from "../../utils/getSumValueOfNode";
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
    }),
    []
  );

  const drawHierarchicalStructure = useCallback((data, svg) => {
    const nodeSize = 20;
    const root = hierarchy(data).eachBefore(
      // for each node and decendandt in pre-order traversal we add am index value,
      // starting with the 0
      ((i) => (d) => {
        d.index = i++;
        d.skip = false;
        d.invert = false;
        d.collapsed = false;
        d.store = d.data.value; // store the values for leaves
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
        d.skip = actionRef.current.skip;
        d.invert = actionRef.current.invert;

        const setChildNodesValues = (child, storeValue) => {
          const cNode = root.find((d) => d.index === child.index);
          cNode.skip = d.skip;
          cNode.invert = d.invert;
          cNode.store = storeValue;
        };

        if (d.skip && !d.invert) {
          if (d.children) {
            d.leaves().forEach((c) => setChildNodesValues(c, 0));
          } else {
            d.store = 0;
          }
        }

        if (d.invert && !d.skip) {
          if (d.children) {
            d.leaves().forEach((c) =>
              setChildNodesValues(
                c,
                d.parent.sumStore && d.parent.sumStore !== 0
                  ? c.data.value * -2
                  : c.data.value * -1
              )
            );
          } else {
            console.log(
              "d.parent.sumStore",
              d.parent.sumStore && d.parent.sumStore !== 0
            );
            d.store =
              d.parent.sumStore && d.parent.sumStore !== 0
                ? d.data.value * -2
                : d.data.value * -1;
            console.log("dv", d.store);
          }
        }

        if (!d.invert && !d.skip) {
          if (d.children) {
            d.leaves().forEach((c) => setChildNodesValues(c, c.data.value));
          } else {
            d.store = d.data.value;
          }
        }

        svg
          .selectAll("g")
          .selectAll("text")
          .style("text-decoration", (d) => {
            return d.skip ? "line-through" : "none";
          });

        svg
          .selectAll("g")
          .selectAll(".label")
          .text((d) => {
            return d.invert ? `-- ${d.data.name}` : d.data.name;
          });

        svg
          .selectAll("g")
          .selectAll(".value")
          .text((d) => {
            console.log("d", d);
            return getSumValueOfNode(d, actionRef.current.invert);
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
      .attr("class", "label")
      .text((d) => d.data.name);

    node // display value
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => (d.depth * nodeSize + 6) * 2)
      .attr("class", "value")
      .text((d) => getSumValueOfNode(d));
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
    <div style={{ marginTop: 10 }}>
      <Toolbar toolbarProps={toolbarProps} actionStatuses={actionRef.current} />
      <svg ref={svgRef}></svg>
    </div>
  );
}
