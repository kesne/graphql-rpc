import { GraphQLSchema } from 'graphql';
import { Variables } from '../types';
export declare function encode(schema: GraphQLSchema, query: string, variables: Variables): any;
