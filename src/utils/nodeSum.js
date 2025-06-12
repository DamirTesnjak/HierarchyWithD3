export default function sum(root) {
  root.eachAfter(function (node) {
    let sum = 0;

    if (node.children && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.skip) continue;

        const val = child.store ?? child.value ?? 0;
        sum += child.invert ? -val : val;
      }
    } else {
      if (!node.skip) {
        const val = node.store ?? node.value ?? 0;
        sum = node.invert ? -val : val;
      }
    }

    node.value = sum;
    node.store = sum;
  });

  return root;
}
