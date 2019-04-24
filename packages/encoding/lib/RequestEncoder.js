import * as impl from './impl/bespoke';
var RequestEncoder = /** @class */ (function () {
    function RequestEncoder(schema, implementation) {
        if (implementation === void 0) { implementation = impl; }
        this.schema = schema;
        this.implementation = implementation;
    }
    RequestEncoder.prototype.encode = function (query, variables) {
        return this.implementation.encode(this.schema, query, variables);
    };
    return RequestEncoder;
}());
export default RequestEncoder;
