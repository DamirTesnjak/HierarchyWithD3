import "./contextMenu.css";

export function ContextMenu() {
  return (
    <ul id="context-menu">
      <li id="skip">Skip</li>
      <li id="invert">Invert</li>
      <li id="fontStyle">
        <form>
          <label id="label" htmlFor="fontStyle">
            Font style
          </label>
          <div>
            <input id="bold" className="button" type="button" value="B" />
            <input id="italic" className="button" type="button" value="I" />
          </div>
        </form>
      </li>
      <li id="fontColor">
        <form>
          <label id="label" htmlFor="fontColor">
            Font color:
          </label>
          <input
            className="button"
            style={{ width: 30 }}
            type="color"
            id="button"
            name="fontColor"
            defaultValue="#ff0000"
          />
          <input
            id="applyColorButton"
            className="button"
            type="button"
            value="Apply color"
          />
        </form>
      </li>
      <li id="fontSize">
        <form>
          <label htmlFor="ifontSize">Font size (px)</label>
          <input
            style={{ width: 50 }}
            type="text"
            id="ifontSize"
            name="ifontSize"
          />
          <input
            id="applySizeButton"
            className="button"
            type="button"
            value="Apply size"
          />
        </form>
      </li>
    </ul>
  );
}
