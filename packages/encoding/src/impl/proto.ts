import path from 'path';
import protobuf from 'protobufjs';
import { GraphQLSchema } from 'graphql';
import * as IR from '../ir';
import { Variables, RootIR } from '../types';

const root = protobuf.loadSync(path.join(__dirname, 'request.proto'));
const Request = root.lookupType('RequestSelection');

export function encode(schema: GraphQLSchema, query: string, variables: Variables) {
    const ir = IR.create(schema, query, variables, {
        getType(type) {
            if (type === 'mutation') return 1;
            if (type === 'subscription') return 2;
        }
    });

    return Request.encode(Request.fromObject(ir)).finish();
}

export function decode(schema: GraphQLSchema, data: Buffer) {
    const ir = (Request.decode(data) as unknown) as RootIR<number>;
    return IR.deflate<number>(schema, ir, {
        getType(type) {
            if (type === 1) return 'mutation';
            if (type === 2) return 'subscription';
            return 'query';
        }
    });
}
