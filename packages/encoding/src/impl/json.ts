import { GraphQLSchema } from 'graphql';
import compress from 'graphql-query-compress';

export function encode(schema: GraphQLSchema, query: string) {
    return Buffer.from(
        JSON.stringify({
            query: compress(query)
        })
    );
}

export function decode(schema: GraphQLSchema, blob: Buffer) {
    return JSON.parse(blob.toString('utf8'));
}
