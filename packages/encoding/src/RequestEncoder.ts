import { GraphQLSchema } from "graphql";
import * as impl from './impl/json';

export default class RequestEncoder {
    constructor(private schema: GraphQLSchema, private implementation = impl) {}

    encode(query: string) {
        return this.implementation.encode(this.schema, query);
    }
}
