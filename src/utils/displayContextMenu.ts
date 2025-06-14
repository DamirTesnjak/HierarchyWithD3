import { select } from "d3";
import { IonClickNode, onClickNode } from "./onClickNode";
import { INode } from "components/TreeView/type";



type Args = {
  d: IonClickNode["d"];
  actionRef: IonClickNode["actionRef"];
  root: IonClickNode["root"];
  group: IonClickNode["group"];
}

export function displayContextMenu(e: any, args: Args) {
  e.preventDefault(); // Prevent default browser context menu

  const contextMenu = select("#context-menu");

  contextMenu
    .style("display", "block")
    .style("position", "absolute")
    .style("z-Index", 2)
    .style("left", `${e.pageX}px`)
    .style("top", `${e.pageY}px`);

  const body = select("body");

  const { d, root, group } = args;

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
      onClickNode({
        d,
        actionRef: menuActionRef,
        root,
        group,
        checkChildren: true,
      });
    });

  contextMenu
    .select("#invert")
    .style("font-weight", d.inverted ? "bold" : "normal")
    .on("click", function (e) {
      let menuActionRef = {
        current: {
          invert: d.inverted ? false : true,
          skip: false,
        },
      };

      onClickNode({
        d,
        actionRef: menuActionRef,
        root,
        group,
        checkChildren: d.children ? true : false,
      });

      const ancestors = d.ancestors();

      ancestors.forEach((d) => {
        const parent = d;
        const parentLeaves = parent.leaves();
        const parentLeavesLengthInvertedValues = parentLeaves.filter(
          (d: INode) => d.inverted
        );

        if (parentLeaves.length === parentLeavesLengthInvertedValues.length) {
          menuActionRef = {
            current: {
              skip: d.skipped ? false : true,
              invert: true,
            },
          };
        } else {
          menuActionRef = {
            current: {
              skip: d.skipped ? false : true,
              invert: false,
            },
          };
        }

        onClickNode({
          d: parent,
          actionRef: menuActionRef,
          root,
          group,
          checkChildren: false,
        });
      });
    });

  const fontStyle = contextMenu.select("#fontStyle");
  const fontStyleLabel = fontStyle.select("#label");
  const fontStyleBoldButton = fontStyle.select("#bold");
  const fontStyleItalicButton = fontStyle.select("#italic");
  const fontColor = contextMenu.select("#fontColor");
  const fontColorLabel = fontColor.select("#label");
  const fontColorButton = fontColor.select("#button");
  const fontColorApplyButton = fontColor.select("#applyColorButton");

  const fontSize = contextMenu.select("#fontSize");
  const fontSizeInput = fontSize.select("#ifontSize");
  const fontSizeApplyButton = fontSize.select("#applySizeButton");

  fontStyleLabel.style(
    "font-weight",
    d.fontBold || d.fontItalic ? "bold" : "normal"
  );
  fontStyleBoldButton
    .style("font-weight", d.fontBold ? "bold" : "normal")
    .style("background-color", d.fontBold ? "#99ccff" : "#fff")
    .on("click", function (e) {
      const menuActionRef = {
        current: {
          invert: d.inverted,
          skip: d.skipped,
        },
      };
      d.fontBold = !d.fontBold;
      onClickNode({
        d,
        actionRef: menuActionRef,
        root,
        group,
        checkChildren: false,
      });
    });

  fontStyleItalicButton
    .style("font-weight", d.fontItalic ? "bold" : "normal")
    .style("font-style", "italic")
    .style("background-color", d.fontItalic ? "#99ccff" : "#fff")

    .on("click", function (e) {
      const menuActionRef = {
        current: {
          invert: d.inverted,
          skip: d.skipped,
        },
      };
      d.fontItalic = !d.fontItalic;
      onClickNode({
        d,
        actionRef: menuActionRef,
        root,
        group,
        checkChildren: false,
      });
    });

  fontColorLabel.style("font-weight", d.color ? "bold" : "normal");

  fontColorButton.on("click", function (e) {
    e.stopPropagation();
  });

  fontColorApplyButton.on("click", function (e) {
    const selectedFontColor = fontColorButton.property("value");
    const menuActionRef = {
      current: {
        invert: d.inverted,
        skip: d.skipped,
      },
    };
    d.fontColor = selectedFontColor;
    onClickNode({
      d,
      actionRef: menuActionRef,
      root,
      group,
      checkChildren: false,
    });
  });

  fontSizeInput.on("click", function (e) {
    e.stopPropagation();
  });

  fontSizeApplyButton.on("click", function (e) {
    const selectedFontSize = fontSizeInput.property("value");
    const menuActionRef = {
      current: {
        invert: d.inverted,
        skip: d.skipped,
      },
    };
    d.fontSize = `${selectedFontSize}px`;
    onClickNode({
      d,
      actionRef: menuActionRef,
      root,
      group,
      checkChildren: false,
    });
  });

  body.on("click", () => contextMenu.style("display", "none"));
}
