import msgpack from 'msgpack5';
import createIR from '../createIR';
function optimizeIR(ir) {
    var optimized = ir;
    if ('selections' in ir && ir.selections) {
        ir.selections.forEach(function (selection) { return optimizeIR(selection); });
    }
    if ('arguments' in ir && ir.arguments) {
        ir.arguments.forEach(function (arg) { return optimizeIR(arg); });
    }
    Object.keys(ir).forEach(function (key) {
        if (key.length > 1) {
            optimized[key.charAt(0)] = optimized[key];
            delete optimized[key];
        }
    });
}
export function encode(schema, query, variables) {
    var encoder = msgpack();
    var ir = createIR(schema, query, variables, {
        getType: function (type) {
            if (type === 'mutation')
                return 1;
            if (type === 'subscription')
                return 2;
        }
    });
    optimizeIR(ir);
    return Buffer.from(encoder.encode(ir).toString('hex'), 'hex');
}
