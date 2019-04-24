import avro from 'avsc';
import { GraphQLSchema } from 'graphql';
import createIR from '../ir/create';
import { Variables } from '../types';

export function encode(schema: GraphQLSchema, query: string, variables: Variables) {
    const protocol = avro.readProtocol(`
        protocol {
            enum Type {
                QUERY, MUTATION, SUBSCRIPTION
            }

            record Argument {
                int arg;
                bytes value;
            }

            record ChildSelection {
                int id;
                int fields;
                union { null, array<ChildSelection> } selections = null;
                union { null, array<Argument> } arguments = null;
            }

            record RequestSelection {
                union { null, Type } type = null;
                int fields;
                union { null, array<ChildSelection> } selections = null;
            }
        }
    `);

    const Root = avro.Type.forSchema(protocol.types);
    // @ts-ignore
    const [_, __, ___, Request] = Root.types;

    const ir = createIR(schema, query, variables, {
        getType(type) {
            if (type === 'query') return null;
            return type.toUpperCase();
        }
    });

    return Request.toBuffer(ir);
}
