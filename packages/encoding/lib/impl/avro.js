var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import avro from 'avsc';
import createIR from '../createIR';
export function encode(schema, query, variables) {
    var protocol = avro.readProtocol("\n        protocol {\n            enum Type {\n                QUERY, MUTATION, SUBSCRIPTION\n            }\n\n            record Argument {\n                int arg;\n                bytes value;\n            }\n\n            record ChildSelection {\n                int id;\n                int fields;\n                union { null, array<ChildSelection> } selections = null;\n                union { null, array<Argument> } arguments = null;\n            }\n\n            record RequestSelection {\n                union { null, Type } type = null;\n                int fields;\n                union { null, array<ChildSelection> } selections = null;\n            }\n        }\n    ");
    var Root = avro.Type.forSchema(protocol.types);
    // @ts-ignore
    var _a = __read(Root.types, 4), _ = _a[0], __ = _a[1], ___ = _a[2], Request = _a[3];
    var ir = createIR(schema, query, variables, {
        getType: function (type) {
            if (type === 'query')
                return null;
            return type.toUpperCase();
        }
    });
    return Request.toBuffer(ir);
}
