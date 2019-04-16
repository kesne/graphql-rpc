export = index;

declare function index(
    string: string
): {
    body: string;
    attributes: { [key: string]: any };
};

declare namespace index {
    function stream(callback: any): any;
}
