import { hierarchy, select } from "d3";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { transformData } from "../../utils/transformData";
import { getSumValueOfNode } from "../../utils/getSumValueOfNode";
import Toolbar from "../Toolbar";
import { fontColor } from "../../utils/fontColor";

export function TreeView() {
  const data = useMemo(
    () => ({
      Total: [
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
    const nodeSize = 25;
    const root = hierarchy(data).eachBefore(
      // for each node and decendandt in pre-order traversal we add am index value,
      // starting with the 0
      ((i) => (d) => {
        d.index = i++;
        d.collapsed = false;
        d.store = d.data.value; // store the values for leaves
        d.inverted = false; // tag if value is inverted
        d.skipped = false; // tag if value is skippd
      })(0)
    );
    const nodes = root.descendants();

    const width = 250;
    const height = nodes.length * nodeSize;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-10, -15, width, height])
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

        const setChildNodesValues = (child, storeValue, inverted, skipped) => {
          const cNode = root.find((d) => d.index === child.index);
          cNode.store = storeValue;
          cNode.inverted = inverted;
          cNode.skipped = skipped;
        };

        if (d.skip && !d.invert) {
          if (d.children) {
            d.leaves().forEach((c) => setChildNodesValues(c, 0, false, true));
          } else {
            d.store = 0;
            d.inverted = false;
            d.skipped = true;
          }
        }

        if (d.invert && !d.skip) {
          if (d.children) {
            d.leaves().forEach((c) =>
              setChildNodesValues(c, -c.data.value, true, false)
            );
          } else {
            d.store = -d.data.value;
            d.inverted = true;
            d.skipped = false;
          }
        }

        if (!d.invert && !d.skip) {
          if (d.children) {
            d.leaves().forEach((c) =>
              setChildNodesValues(c, c.data.value, false, false)
            );
          } else {
            d.store = d.data.value;
            d.inverted = false;
            d.skipped = false;
          }
        }

        svg
          .selectAll("g")
          .attr("fill", (d) => (d.children ? "grey" : "black"))
          .selectAll("text")
          .style("text-decoration", (d) => {
            return d.skipped ? "line-through" : "none";
          });

        svg
          .selectAll("g")
          .selectAll(".label")
          .attr("x", (d) => 10 * (d.depth > 0 ? d.depth : 1))
          .attr("fill", (d) => fontColor(d))
          .text((d) => (d.inverted ? `-${d.data.name}` : d.data.name));

        svg
          .selectAll("g")
          .selectAll(".value")
          .attr(
            "x",
            (d) =>
              svg.select(".label").node().getBBox().width +
              (d.depth > 0 ? d.depth : 1) * 25
          )
          .attr("fill", (d) => fontColor(d))
          .text((d) => {
            return getSumValueOfNode(d, actionRef.current.invert).toFixed(2);
          });
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
      .attr(
        "x",
        (d) =>
          svg.select(".label").node().getBBox().width +
          (d.depth > 0 ? d.depth : 1) * 25
      )
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
    <div style={{ marginTop: 10 }}>
      <Toolbar toolbarProps={toolbarProps} actionStatuses={actionRef.current} />
      <div>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
