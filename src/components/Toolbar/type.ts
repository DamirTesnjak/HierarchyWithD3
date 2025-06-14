type IAction = {
    buttonType: "submit" | "reset" | "button";
    action: () => {
        invert: boolean;
        skip: boolean;
    };
}

interface IToolbar {
    toolbarProps: {
        skip: IAction;
        invert: IAction;
    }
}