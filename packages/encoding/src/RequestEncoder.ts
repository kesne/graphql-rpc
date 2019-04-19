import { GraphQLSchema } from "graphql";
import * as impl from './impl/bespoke';
import { Variables } from "./types";

export default class RequestEncoder {
    constructor(private schema: GraphQLSchema, private implementation = impl) {}

    encode(query: string, variables: Variables): Buffer | Uint8Array {
        return this.implementation.encode(this.schema, query, variables);
    }
}
