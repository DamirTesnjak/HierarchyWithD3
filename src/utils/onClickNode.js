import { select } from "d3";
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
          dirty: true,
          node: root,
        })
      );
    } else {
      d.store = 0;
      d.inverted = false;
      d.skipped = true;
      d.dirty = true;
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
          dirty: true,
          node: root,
        })
      );
    } else {
      d.store = -d.data.value;
      d.inverted = true;
      d.skipped = false;
      d.dirty = true;
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
          dirty: true,
          node: root,
        })
      );
    } else {
      d.store = d.data.value;
      d.inverted = false;
      d.skipped = false;
      d.dirty = true;
    }
  }

  const nodes = group.selectAll("g");
  const texts = nodes.selectAll("text");
  const labels = nodes.selectAll(".label");
  const values = nodes.selectAll(".value");

  group.selectAll("g").each(function (d) {
    const node = select(this);

    if (d.dirty) {
      node.style("text-decoration", (d) => {
        return d.skipped ? "line-through" : "none";
      });

      node
        .attr("x", (d) => 10 * (d.depth > 0 ? d.depth : 1))
        .attr("fill", (d) => fontColor(d))
        .text((d) => (d.inverted ? `-${d.data.name}` : d.data.name));

      node
        .attr("x", (d) => valueTextPosition(d, labelWidth))
        .attr("fill", (d) => fontColor(d))
        .text((d) => {
          return getSumValueOfNode(d, actionRef.current.invert).toFixed(2);
        });
    }

    d.dirty = false;
  });
}
