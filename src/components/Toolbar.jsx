import Button from "./Button";

export default function Toolbar(props) {
  const { toolbarProps } = props;
  return (
    <div>
      <Button
        text={toolbarProps.skip.buttonText}
        type={toolbarProps.skip.buttonType}
        onClick={toolbarProps.skip.action}
      />
      <Button
        text={toolbarProps.invert.buttonText}
        type={toolbarProps.invert.buttonType}
        onClick={toolbarProps.invert.action}
      />
    </div>
  );
}
