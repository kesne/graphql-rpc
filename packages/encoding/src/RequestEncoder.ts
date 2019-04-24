import { GraphQLSchema } from "graphql";
import * as impl from './impl/proto';
import { Variables } from "./types";

interface Request {
    query: string;
    variables: Variables;
};

export default class RequestEncoder {
    constructor(private schema: GraphQLSchema, private implementation = impl) {}

    encode(request: Request): Buffer | Uint8Array {
        return this.implementation.encode(this.schema, request.query, request.variables);
    }

    decode(data: Buffer): Request {
        return this.implementation.decode(this.schema, data);
    }
}
