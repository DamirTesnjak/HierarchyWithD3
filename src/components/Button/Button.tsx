import "./button.css";

export default function Button(props: IButton) {
  const { text, skip, invert, onClick } = props;

  return (
    <button
      style={{ fontWeight: skip || invert ? 500 : 300 }}
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
