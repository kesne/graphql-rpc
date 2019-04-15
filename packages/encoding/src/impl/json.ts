import { GraphQLSchema } from 'graphql';
import compress from 'graphql-query-compress';

export function encode(schema: GraphQLSchema, query: string) {
    return JSON.stringify({
        query: compress(query)
    });
}

export function decode(schema: GraphQLSchema, blob: Buffer) {
    return JSON.parse(blob.toString('utf-8'));
}
