/// <reference types="node" />
import { GraphQLSchema } from 'graphql';
import { Variables } from '../types';
export declare function encode(_schema: GraphQLSchema, query: string, variables: Variables): Buffer;
export declare function decode(_schema: GraphQLSchema, blob: Buffer): any;
