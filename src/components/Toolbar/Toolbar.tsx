import { useState } from "react";
import Button from "../Button/Button";

export default function Toolbar(props: IToolbar) {
  const { toolbarProps } = props;
  const [actionsTriggered, setActionsTriggered] = useState({
    skip: false,
    invert: false,
  });

  return (
    <div>
      <Button
        text={actionsTriggered.skip ? "Skip: on" : "Skip: off"}
        skip={actionsTriggered.skip}
        onClick={() => {
          toolbarProps.skip.action();
          setActionsTriggered({
            skip: !actionsTriggered.skip,
            invert: false,
          });
        }}
      />
      <Button
        text={actionsTriggered.invert ? "Invert: on" : "Invert: off"}
        invert={actionsTriggered.invert}
        onClick={() => {
          toolbarProps.invert.action();
          setActionsTriggered({
            skip: false,
            invert: !actionsTriggered.invert,
          });
        }}
      />
    </div>
  );
}
