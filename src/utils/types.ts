import { INode } from "components/TreeView/type"

export type ActionRef = {
    current: {
        skip: INode["skipped"],
        invert: INode["inverted"]
    }
}