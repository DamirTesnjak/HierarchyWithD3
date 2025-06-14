import { select } from "d3";
import { setChildNodesValues } from "./setChildValues";
import { fontColor } from "./fontColor";
import { valueTextPosition } from "./valueTextPosition";
import { getSumValueOfNode } from "./getSumValueOfNode";
import { INode } from "components/TreeView/type";
import { ActionRef } from "./types";

export type IonClickNode = {
  d: INode;
  actionRef: ActionRef;
  root: INode;
  group: any;
  checkChildren: boolean;
}

export function onClickNode({
  d,
  actionRef,
  root,
  group,
  checkChildren,
}: IonClickNode) {
  d.skip = actionRef.current.skip; // editing mode set to "skip values" from toolbar
  d.invert = actionRef.current.invert; // editing mode set to "invert values" from toolbar

  const descendants = d.descendants();

  if (d.skip && !d.invert) {
    if (d.children && checkChildren) {
      descendants.forEach((c) =>
        setChildNodesValues({
          child: c,
          storeValue: 0,
          inverted: false,
          skipped: true,
          dirty: true,
          node: root,
        })
      );
    }
    d.store = 0;
    d.inverted = false;
    d.skipped = true;
    d.dirty = true;
  }

  if (d.invert && !d.skip) {
    if (d.children && checkChildren) {
      descendants.forEach((c) =>
        setChildNodesValues({
          child: c,
          storeValue: -c.data.value,
          inverted: true,
          skipped: false,
          dirty: true,
          node: root,
        })
      );
    }
    d.store = -d.data.value;
    d.inverted = true;
    d.skipped = false;
    d.dirty = true;
  }

  if (!d.invert && !d.skip) {
    if (d.children && checkChildren) {
      descendants.forEach((c) =>
        setChildNodesValues({
          child: c,
          storeValue: c.data.value,
          inverted: false,
          skipped: false,
          dirty: true,
          node: root,
        })
      );
    }
    d.store = d.data.value;
    d.inverted = false;
    d.skipped = false;
    d.dirty = true;
  }

  group.selectAll("g").each(function (d: INode) {
    // select current node
    // @ts-ignore
    const node = select(this);

    // maintain structure by selecting, the function will render the element
    const label = node.select(".label");
    const value = node.select(".value");
    value.text((d) => {
      const dn = d as INode;
      return getSumValueOfNode(dn, actionRef.current.invert).toFixed(2);
    });

    // make changes only to those elements that their values are changed
    if (d.dirty) {
      node.style("text-decoration", (d) => {
        const dn = d as INode;
        return dn.skipped ? "line-through" : "none";
      });

      label
        .attr("x", (d) => {
          const dn = d as INode;
          return 10 * (dn.depth > 0 ? dn.depth : 1)
        })
        .attr("fill", (d) => {
          const dn = d as INode;
          return fontColor(dn)
        })
        .attr("font-size", (d) => {
          const dn = d as INode;
          return dn.fontSize
        })
        .attr("font-weight", (d) => {
          const dn = d as INode;
          return dn.fontBold ? "bold" : "normal"
        })
        .attr("font-style", (d) => {
          const dn = d as INode;
          return dn.fontItalic ? "italic" : "normal"
        })
        .text((d) => {
          const dn = d as INode;
          return dn.inverted ? `-${dn.data.name}` : dn.data.name
        });

      value
        .attr("x", (d) => {
          const dn = d as INode;
          return valueTextPosition(dn)
        })
        .attr("fill", (d) => {
          const dn = d as INode;
          return fontColor(dn)
        })
        .attr("font-size", (d) => {
          const dn = d as INode;
          return dn.fontSize
        })
        .attr("font-weight", (d) => {
          const dn = d as INode;
          return dn.fontBold ? "bold" : "normal"
        })
        .attr("font-style", (d) => {
          const dn = d as INode;
          return dn.fontItalic ? "italic" : "normal"
        })
        .text((d) => {
          const dn = d as INode;
          return getSumValueOfNode(dn, actionRef.current.invert).toFixed(2);
        });
    }

    d.dirty = false;
  });
}
