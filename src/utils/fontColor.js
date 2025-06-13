export function fontColor(d) {
  if (d.children) {
    return "black";
  }
  if (d.store < 0) {
    return "red";
  }
  return "grey";
}
