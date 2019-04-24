import path from 'path';
import protobuf from 'protobufjs';
import createIR from '../createIR';
export function encode(schema, query, variables) {
    var root = protobuf.loadSync(path.join(__dirname, 'request.proto'));
    var Request = root.lookupType('RequestSelection');
    var ir = createIR(schema, query, variables, {
        getType: function (type) {
            if (type === 'mutation')
                return 1;
            if (type === 'subscription')
                return 2;
        }
    });
    return Request.encode(Request.fromObject(ir)).finish();
}
