type IAction = {
    buttonType: IButton["type"];
    action: () => {};
}

interface IToolbar {
    toolbarProps: {
        skip: IAction;
        invert: IAction;
    }
}