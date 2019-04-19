import path from 'path';
import varint from 'varint';
import { parse, GraphQLSchema, OperationDefinitionNode, FieldNode } from 'graphql';

function resolveType(node: any): any {
    if (node.ofType) {
        return resolveType(node.ofType);
    }

    if (node.type && node.type.ofType) {
        return resolveType(node.type.ofType);
    }

    if (node.type) {
        return resolveType(node.type);
    }

    return node;
}

const TYPE_QUERY = 0;
const TYPE_MUTATION = 1;
const TYPE_SUBSCRIPTION = 2;

const FIELD_EXIT = 3;
// Use an enter offset to make it unambiguous with query (0) mutation (1) subscription (2) and pop (3)
const FIELD_ENTER_OFFSET = 4;

export function encode(schema: GraphQLSchema, query: string) {
    // TODO: Don't do fixed size:
    const data: number[] = [];

    const requestDescription: any = {
        fields: 0
    };

    const parsedQuery = parse(query);

    const operationDefinition = parsedQuery.definitions[0] as OperationDefinitionNode;

    function write(num: number) {
        varint.encode(num).forEach(byte => {
            data.push(byte);
        });
    }

    function optimizeQuery() {
        let i = data.length - 1;
        while (data[i] === FIELD_EXIT) {
            data.splice(i, 1);
            i--;
        }
    }

    function walkSelections(selectionDescription: any, node: FieldNode, schemaNode: any) {
        const selections = node.selectionSet!.selections;
        const schemaFields = schemaNode.getFields();

        selections.forEach((selection, i) => {
            if (selection.kind !== 'Field') {
                throw new Error('Only field selections are currently supported.');
            }

            const selectionNode = schemaFields[selection.name.value];
            const fieldDirective = selectionNode.astNode.directives.find(
                (dir: any) => dir.name.value === 'field'
            );
            // Only ever has one argument right now:
            const fieldNumber = parseInt(fieldDirective.arguments[0].value.value, 10) - 1;

            selectionDescription.fields |= 1 << fieldNumber;
        });

        write(selectionDescription.fields);

        selections.forEach(selection => {
            if (selection.kind !== 'Field') {
                throw new Error('Only field selections are currently supported.');
            }

            const selectionNode = schemaFields[selection.name.value];
            const fieldDirective = selectionNode.astNode.directives.find(
                (dir: any) => dir.name.value === 'field'
            );
            // Only ever has one argument right now:
            const fieldNumber = parseInt(fieldDirective.arguments[0].value.value, 10) - 1;

            if (selection.selectionSet) {
                write(fieldNumber + 1 + FIELD_ENTER_OFFSET);
                if (!selectionDescription.selections) {
                    selectionDescription.selections = [];
                }

                const data = { field: fieldNumber, fields: 0 };
                selectionDescription.selections.push(data);

                walkSelections(
                    data,
                    selection,
                    resolveType(schemaNode.getFields()[selection.name.value])
                );

                write(FIELD_EXIT);
            }
        });
    }

    walkSelections(requestDescription, operationDefinition as any, schema.getQueryType());

    switch (operationDefinition.operation) {
        case 'mutation':
            write(TYPE_MUTATION);
            break;
        case 'subscription':
            write(TYPE_SUBSCRIPTION);
            break;
        case 'query':
            // For query, we can actually optimize by ditching any trailing pops:
            optimizeQuery();
            break;
        default:
            throw new Error();
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
            if (data[offset] > FIELD_ENTER_OFFSET) {
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
