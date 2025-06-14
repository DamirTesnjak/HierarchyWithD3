export function fontColor(d) {
  if (d.inverted) {
    return "red";
  }
  if (d.children) {
    return d.fontColor ? d.fontColor : "black";
  }

  return d.fontColor ? d.fontColor : "grey";
}
