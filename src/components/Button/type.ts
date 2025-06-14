interface IButton {
    text: string;
    type: 'submit' | 'reset' | 'button';
    skip?: boolean;
    invert?: boolean;
    onClick: () => void;
}