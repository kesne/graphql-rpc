import path from 'path';
import protobuf from 'protobufjs';
import { parse, GraphQLSchema, OperationDefinitionNode, FieldNode } from 'graphql';
import BitMask from 'bit-mask';

export function encode(schema: GraphQLSchema, query: string) {
    const root = protobuf.loadSync(path.join(__dirname, 'request.proto'));

    const Request = root.lookupType('Request');

    const requestDescription: any = {};

    const parsedQuery = parse(query);

    const operationDefinition = parsedQuery.definitions[0] as OperationDefinitionNode;

    switch (operationDefinition.operation) {
        case 'mutation':
            requestDescription.type = 1;
            break;
        case 'subscription':
            requestDescription.type = 2;
        case 'query':
        default:
            // Do nothing, default is 0, which is query:
            break;
    }

    requestDescription.selection = { fields: new BitMask(0, 2) };

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

            selectionDescription.fields.setBit(fieldNumber, true);

            if (selection.selectionSet) {
                if (!selectionDescription.selections) {
                    selectionDescription.selections = {};
                }

                if (!selectionDescription.selections[fieldNumber]) {
                    selectionDescription.selections[fieldNumber] = { fields: new BitMask(0, 2) };
                }

                walkSelections(
                    selectionDescription.selections[fieldNumber],
                    selection,
                    resolveType(schemaNode.getFields()[selection.name.value])
                );
            }
        });

        // Write bitmask as a number:
        selectionDescription.fields = parseInt(selectionDescription.fields.bits(), 2);
    }

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

    walkSelections(requestDescription.selection, operationDefinition as any, schema.getQueryType());

    return Request.encode(Request.fromObject(requestDescription)).finish();
}
