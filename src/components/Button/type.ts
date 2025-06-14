interface IButton {
    text: string;
    skip?: boolean;
    invert?: boolean;
    onClick: () => void;
}