import msgpack from 'msgpack5';
import { GraphQLSchema } from 'graphql';
import createIR, { IR, ChildIR, ArgumentIR } from '../ir/create';
import { Variables } from '../types';

function optimizeIR(ir: IR | ChildIR | ArgumentIR) {
    let optimized: any = ir;

    if ('selections' in ir && ir.selections) {
        ir.selections.forEach(selection => optimizeIR(selection));
    }

    if ('arguments' in ir && ir.arguments) {
        ir.arguments.forEach(arg => optimizeIR(arg));
    }

    Object.keys(ir).forEach(key => {
        if (key.length > 1) {
            optimized[key.charAt(0)] = optimized[key];
            delete optimized[key];
        }
    });
}

export function encode(schema: GraphQLSchema, query: string, variables: Variables) {
    const encoder = msgpack();

    const ir = createIR(schema, query, variables, {
        getType(type) {
            if (type === 'mutation') return 1;
            if (type === 'subscription') return 2;
        }
    });

    optimizeIR(ir);

    return Buffer.from(encoder.encode(ir).toString('hex'), 'hex');
}
