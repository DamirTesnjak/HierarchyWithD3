import "./button.css";

export default function Button(props) {
  const { text, type, skip, invert, onClick } = props;

  return (
    <button
      style={{ fontWeight: skip || invert ? 500 : 300 }}
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
