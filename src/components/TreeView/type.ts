import { HierarchyNode } from "d3";

export interface Inode {
    index: number;
    store: number;
    inverted: boolean;
    skipped: boolean;
    dirty: boolean;
    fontSize: string;
    fontBold: boolean;
    fontItalic: boolean;
    fontColor: string;
}