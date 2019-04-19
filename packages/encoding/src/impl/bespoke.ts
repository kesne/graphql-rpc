import varint from 'varint';
import { GraphQLSchema } from 'graphql';
import createIR, { IR, ChildIR } from '../createIR';
import { Variables } from '../types';

// NOTE: Even though we never use 0, we still reserve it and don't use it for mutations to make it side-effect-free to zero-fill the buffer.
const TYPE_QUERY = 0;
const TYPE_MUTATION = 1;
const TYPE_SUBSCRIPTION = 2;
const FIELD_EXIT = 3;
const FIELD_ARGUMENT = 4;
// Use an enter offset to make it unambiguous with query (0) mutation (1) subscription (2) exit (3) and arguments (4)
const FIELD_ENTER_OFFSET = 6;

function stripTrailingExits(data: number[]) {
    let i = data.length - 1;
    while (data[i] === FIELD_EXIT) {
        data.splice(i, 1);
        i--;
    }
}

export function encode(schema: GraphQLSchema, query: string, variables: Variables) {
    const data: number[] = [];

    function write(num: number | number[]) {
        if (Array.isArray(num)) {
            num.forEach(n => write(n));
        } else {
            varint.encode(num).forEach(byte => {
                data.push(byte);
            });
        }
    }

    function walkIR(current: ChildIR | IR) {
        write(current.fields);
        if ('arguments' in current && current.arguments) {
            write(FIELD_ARGUMENT);
            for (const argument of current.arguments) {
                write(argument.arg);
                // TODO: Really should get better null handling:
                write(argument.value ? argument.value.length : 0);
                if (argument.value) {
                    write([...argument.value]);
                }
            }
        }

        if (current.selections) {
            for (const selection of current.selections) {
                write(FIELD_ENTER_OFFSET + selection.id);
                walkIR(selection);
                write(FIELD_EXIT);
            }
        }
    }

    const ir = createIR(schema, query, variables, {
        getType: type => type
    });

    walkIR(ir);
    stripTrailingExits(data);

    switch (ir.type) {
        case 'mutation':
            write(TYPE_MUTATION);
            break;
        case 'subscription':
            write(TYPE_SUBSCRIPTION);
            break;
    }

    return Buffer.from(data);
}

// NOTE: This isn't complete, it's just a proof-of-concept:
function decode(data: number[]) {
    const root: any = {};
    let offset = 0;

    function resolveField(selection = root) {
        selection.fields = varint.decode(data, offset);
        offset += varint.decode.bytes;

        if (data[offset]) {
            // We're pushing a field:
            if (data[offset] >= FIELD_ENTER_OFFSET) {
                selection.children = selection.children || {};
                const field = varint.decode(data, offset) - FIELD_ENTER_OFFSET;
                offset += varint.decode.bytes;
                selection.children[field] = {};
                resolveField(selection.children[field]);
            }
        }
    }

    resolveField();

    return root;
}
