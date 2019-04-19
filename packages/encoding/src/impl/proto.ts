import path from 'path';
import protobuf from 'protobufjs';
import { parse, GraphQLSchema, OperationDefinitionNode, FieldNode } from 'graphql';

export function encode(schema: GraphQLSchema, query: string) {
    const root = protobuf.loadSync(path.join(__dirname, 'request.proto'));
    const Request = root.lookupType('RequestSelection');

    const requestDescription: any = {
        fields: 0,
    };

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

            selectionDescription.fields |= (1 << fieldNumber)

            if (selection.selectionSet) {
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
            }
        });
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

    walkSelections(requestDescription, operationDefinition as any, schema.getQueryType());

    console.log(requestDescription);

    const buf = Request.encode(Request.fromObject(requestDescription)).finish();

    // @ts-ignore
    // console.log(Request.decode(buf).selection);

    return buf;
}
