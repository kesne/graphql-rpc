/// <reference types="node" />
import { GraphQLSchema } from 'graphql';
import { Variables } from './types';
export declare type ArgumentIR = {
    arg: number;
    value: Buffer | null;
};
export declare type ChildIR = {
    id: number;
    fields: number;
    arguments?: ArgumentIR[];
    selections?: ChildIR[];
};
export declare type IR<Type = any> = {
    type: Type;
    fields: number;
    selections?: ChildIR[];
};
export default function createIR<Type>(schema: GraphQLSchema, query: string, variables: Variables, builder: {
    getType(type: 'mutation' | 'subscription' | 'query'): Type;
}): IR<Type>;
