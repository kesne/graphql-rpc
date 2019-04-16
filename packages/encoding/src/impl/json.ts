import { GraphQLSchema } from 'graphql';
import compress from 'graphql-query-compress';

type RequestBody = {
    query: string;
    variables?: any;
};

export function encode(_schema: GraphQLSchema, query: string, variables?: any) {
    const obj: RequestBody = {
        query: compress(query)
    };

    if (variables) {
        obj.variables = variables;
    }

    return Buffer.from(JSON.stringify(obj));
}

export function decode(_schema: GraphQLSchema, blob: Buffer) {
    return JSON.parse(blob.toString('utf8'));
}
