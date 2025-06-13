import "./contextMenu.css";

export function ContextMenu() {
  return (
    <ul id="context-menu">
      <li>Skip</li>
      <li onClick={() => console.log("test")}>Invert</li>
    </ul>
  );
}
