/// <reference types="node" />
import { GraphQLSchema } from "graphql";
import * as impl from './impl/bespoke';
import { Variables } from "./types";
export default class RequestEncoder {
    private schema;
    private implementation;
    constructor(schema: GraphQLSchema, implementation?: typeof impl);
    encode(query: string, variables: Variables): Buffer | Uint8Array;
}
