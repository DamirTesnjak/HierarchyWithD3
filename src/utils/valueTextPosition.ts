import { INode } from "components/TreeView/type";

export function valueTextPosition(d: INode) { return (10 * (d.depth > 0 ? d.depth : 1) + 60) };
