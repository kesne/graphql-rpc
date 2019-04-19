import { GraphQLSchema } from "graphql";
import * as impl from './impl/bespoke';

export default class RequestEncoder {
    constructor(private schema: GraphQLSchema, private implementation = impl) {}

    encode(query: string): Buffer | Uint8Array {
        return this.implementation.encode(this.schema, query);
    }
}
