import { select } from "d3";

export function displayContextMenu(e) {
  e.preventDefault(); // Prevent default browser context menu

  select("#context-menu")
    .style("display", "block")
    .style("position", "absolute")
    .style("z-Index", 2)
    .style("left", `${e.pageX}px`)
    .style("top", `${e.pageY}px`);

  select("body").on("click", () =>
    select("#context-menu").style("display", "none")
  );
}
