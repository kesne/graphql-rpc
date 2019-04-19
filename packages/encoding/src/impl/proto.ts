import path from 'path';
import protobuf from 'protobufjs';
import {
    parse,
    GraphQLSchema,
    OperationDefinitionNode,
    FieldNode,
    InputValueDefinitionNode
} from 'graphql';

export function encode(schema: GraphQLSchema, query: string, variables?: any) {
    const root = protobuf.loadSync(path.join(__dirname, 'request.proto'));
    const Request = root.lookupType('RequestSelection');

    const requestDescription: any = {
        fields: 0
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

    function getFieldNumber(node: FieldNode | InputValueDefinitionNode) {
        if (!node.directives) {
            throw new Error(`No directives found on node ${node.name.value}`);
        }

        const fieldDirective = node.directives.find(dir => dir.name.value === 'field');
        if (!fieldDirective) {
            throw new Error(`No "field" directive found on node ${node.name.value}`);
        }

        // @ts-ignore Only ever has one argument right now:
        return parseInt(fieldDirective.arguments[0].value.value, 10) - 1;
    }

    // TODO: Use graphql visit:
    function walkSelections(selectionDescription: any, node: FieldNode, schemaNode: any) {
        const selections = node.selectionSet!.selections;
        const schemaFields = schemaNode.getFields();

        selections.forEach(selection => {
            if (selection.kind !== 'Field') {
                throw new Error('Only field selections are currently supported.');
            }

            const fieldNode = schemaFields[selection.name.value];
            const fieldNumber = getFieldNumber(fieldNode.astNode);

            selectionDescription.fields |= 1 << fieldNumber;

            if (selection.arguments && selection.arguments.length) {
                selectionDescription.arguments = selectionDescription.arguments || [];

                selection.arguments.forEach(argument => {
                    const argNode = fieldNode.args.find(
                        (arg: any) => arg.name === argument.name.value
                    );
                    const argNumber = getFieldNumber(argNode.astNode);
                    const value =
                        argument.value.kind === 'Variable'
                            ? variables[argument.value.name.value]
                            : argument.value.kind === 'NullValue'
                            ? null
                            // @ts-ignore Need to build a comprehensive value extractor:
                            : argument.value.value;

                    selectionDescription.arguments.push({
                        arg: argNumber,
                        value: value ? Buffer.from(JSON.stringify(value)) : null
                    });
                });
            }

            if (selection.selectionSet) {
                selectionDescription.selections = selectionDescription.selections || [];

                const data = { field: fieldNumber, fields: 0 };
                selectionDescription.selections.push(data);

                walkSelections(data, selection, resolveType(fieldNode));
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

    return Request.encode(Request.fromObject(requestDescription)).finish();
}
