import { setChildNodesValues } from "./setChildValues";
import { fontColor } from "./fontColor";
import { valueTextPosition } from "./valueTextPosition";
import { getSumValueOfNode } from "./getSumValueOfNode";

export function onClickNode({ d, actionRef, labelWidth, root, group }) {
  d.skip = actionRef.current.skip;
  d.invert = actionRef.current.invert;

  if (d.skip && !d.invert) {
    if (d.children) {
      d.leaves().forEach((c) =>
        setChildNodesValues({
          child: c,
          storeValue: 0,
          inverted: false,
          skipped: true,
          node: root,
        })
      );
    } else {
      d.store = 0;
      d.inverted = false;
      d.skipped = true;
    }
  }

  if (d.invert && !d.skip) {
    if (d.children) {
      d.leaves().forEach((c) =>
        setChildNodesValues({
          child: c,
          storeValue: -c.data.value,
          inverted: true,
          skipped: false,
          node: root,
        })
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
        setChildNodesValues({
          child: c,
          storeValue: c.data.value,
          inverted: false,
          skipped: false,
          node: root,
        })
      );
    } else {
      d.store = d.data.value;
      d.inverted = false;
      d.skipped = false;
    }
  }

  group
    .selectAll("g")
    .attr("fill", (d) => (d.children ? "grey" : "black"))
    .selectAll("text")
    .style("text-decoration", (d) => {
      return d.skipped ? "line-through" : "none";
    });

  group
    .selectAll("g")
    .selectAll(".label")
    .attr("x", (d) => 10 * (d.depth > 0 ? d.depth : 1))
    .attr("fill", (d) => fontColor(d))
    .text((d) => (d.inverted ? `-${d.data.name}` : d.data.name));

  group
    .selectAll("g")
    .selectAll(".value")
    .attr("x", (d) => valueTextPosition(d, labelWidth))
    .attr("fill", (d) => fontColor(d))
    .text((d) => {
      return getSumValueOfNode(d, actionRef.current.invert).toFixed(2);
    });
}
