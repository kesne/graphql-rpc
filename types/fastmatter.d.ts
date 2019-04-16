export = index;

declare function index(
    string: string
): {
    body: string;
    attributes: object;
};

declare namespace index {
    function stream(callback: any): any;
}
