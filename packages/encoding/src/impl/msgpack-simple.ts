import msgpack from 'msgpack5';
import { GraphQLSchema } from 'graphql';
import compress from 'graphql-query-compress';

export function encode(schema: GraphQLSchema, query: string) {
    const encoder = msgpack();
    return Buffer.from(
        encoder
            .encode({
                query: compress(query)
            })
            .toString('hex'),
        'hex'
    );
}
