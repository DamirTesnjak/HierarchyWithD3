export function valueTextPosition(d) {
  const siblingLabePositionX = 10 * (d.depth > 0 ? d.depth : 1);
  return 50 + siblingLabePositionX + 10;
}
