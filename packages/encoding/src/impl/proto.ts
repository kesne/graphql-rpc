import path from 'path';
import protobuf from 'protobufjs';
import { GraphQLSchema } from 'graphql';
import createIR from '../createIR';
import { Variables } from '../types';

export function encode(schema: GraphQLSchema, query: string, variables: Variables) {
    const root = protobuf.loadSync(path.join(__dirname, 'request.proto'));
    const Request = root.lookupType('RequestSelection');

    const ir = createIR(schema, query, variables, {
        getType(type) {
            if (type === 'mutation') return 1;
            if (type === 'subscription') return 2;
        }
    });

    return Request.encode(Request.fromObject(ir)).finish();
}
