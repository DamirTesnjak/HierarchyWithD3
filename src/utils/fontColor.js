export function fontColor(d) {
  if (d.children) {
    return d.fontColor ? d.fontColor : "black";
  }
  if (d.store < 0) {
    return "red";
  }
  return d.fontColor ? d.fontColor : "grey";
}
