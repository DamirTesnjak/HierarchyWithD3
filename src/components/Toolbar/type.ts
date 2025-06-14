type IAction = {
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