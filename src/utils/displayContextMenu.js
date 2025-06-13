import { select } from "d3";
import { onClickNode } from "./onClickNode";

export function displayContextMenu(e, args) {
  e.preventDefault(); // Prevent default browser context menu

  const contextMenu = select("#context-menu");

  contextMenu
    .style("display", "block")
    .style("position", "absolute")
    .style("z-Index", 2)
    .style("left", `${e.pageX}px`)
    .style("top", `${e.pageY}px`);

  const body = select("body");

  const { d, actionRef, labelWidth, root, group } = args;

  contextMenu
    .select("#skip")
    .style("font-weight", d.skipped ? "bold" : "normal")
    .on("click", function (e) {
      actionRef.current = { invert: false, skip: true };
      onClickNode({ d, actionRef, labelWidth, root, group });
    });

  contextMenu
    .select("#invert")
    .style("font-weight", d.inverted ? "bold" : "normal")
    .on("click", function (e) {
      actionRef.current = { invert: true, skip: false };
      onClickNode({ d, actionRef, labelWidth, root, group });
    });

  body.on("click", () => contextMenu.style("display", "none"));
}
