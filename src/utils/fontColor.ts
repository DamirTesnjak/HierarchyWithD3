import { INode } from "components/TreeView/type";

export function fontColor(d: INode) {
  if (d.inverted) {
    return "red";
  }
  if (d.children) {
    return d.fontColor ? d.fontColor : "black";
  }

  return d.fontColor ? d.fontColor : "grey";
}
