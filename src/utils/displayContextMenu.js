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

  const { d, labelWidth, root, group } = args;

  contextMenu
    .select("#skip")
    .style("font-weight", d.skipped ? "bold" : "normal")
    .on("click", function (e) {
      const menuActionRef = {
        current: {
          invert: false,
          skip: d.skipped ? false : true,
        },
      };
      onClickNode({ d, actionRef: menuActionRef, labelWidth, root, group });
    });

  contextMenu
    .select("#invert")
    .style("font-weight", d.inverted ? "bold" : "normal")
    .on("click", function (e) {
      const menuActionRef = {
        current: {
          invert: d.inverted ? false : true,
          skip: false,
        },
      };
      onClickNode({ d, actionRef: menuActionRef, labelWidth, root, group });
    });

  body.on("click", () => contextMenu.style("display", "none"));
}
