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
      onClickNode({
        d,
        actionRef: menuActionRef,
        labelWidth,
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
        labelWidth,
        root,
        group,
        checkChildren: d.children,
      });

      const ancestors = d.ancestors();

      ancestors.forEach((d) => {
        const parent = d;
        const parentLeaves = parent.leaves();
        const parentLeavesLengthInvertedValues = parentLeaves.filter(
          (d) => d.inverted
        );

        if (parentLeaves.length === parentLeavesLengthInvertedValues.length) {
          menuActionRef = {
            current: {
              ...menuActionRef.current.skip,
              invert: true,
            },
          };
        } else {
          menuActionRef = {
            current: {
              ...menuActionRef.current.skip,
              invert: false,
            },
          };
        }

        onClickNode({
          d: parent,
          actionRef: menuActionRef,
          labelWidth,
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
    d.fontBold || d.italic ? "bold" : "normal"
  );
  fontStyleBoldButton
    .style("font-weight", d.bold ? "bold" : "normal")
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
        labelWidth,
        root,
        group,
        checkChildren: false,
      });
    });

  fontStyleItalicButton
    .style("font-weight", d.fontItalic ? "bold" : "normal")
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
        labelWidth,
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
      labelWidth,
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
      labelWidth,
      root,
      group,
      checkChildren: false,
    });
  });

  body.on("click", () => contextMenu.style("display", "none"));
}
