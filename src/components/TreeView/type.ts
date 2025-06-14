import { HierarchyNode } from "d3";

export interface INode extends HierarchyNode<any> {
    index: number;
    store: number;
    inverted: boolean;
    invert: boolean;
    skipped: boolean;
    skip: boolean;
    dirty: boolean;
    fontSize: string;
    fontBold: boolean;
    fontItalic: boolean;
    fontColor: string;
    depth: number;
    sumStore: number;
    color: string;
}