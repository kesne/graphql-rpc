import msgpack from 'msgpack5';
import { parse, GraphQLSchema, OperationDefinitionNode, FieldNode, GraphQLField } from 'graphql';

export function encode(schema: GraphQLSchema, query: string) {
    const parsedQuery = parse(query);
    const encoder = msgpack();

    const payload: any = {};

    const operationDefinition = parsedQuery.definitions[0] as OperationDefinitionNode;

    switch (operationDefinition.operation) {
        case 'mutation':
            payload.t = 1;
            break;
        case 'subscription':
            payload.t = 2;
        case 'query':
        default:
            // Do nothing, default is query:
            break;
    }

    payload.s = { f: 0 };

    function walkSelections(s: any, node: FieldNode, schemaNode: any) {
        const selections = node.selectionSet!.selections;

        // console.log(schemaNode);
        const schemaFields = schemaNode.getFields();

        selections.forEach((selection, i) => {
            if (selection.kind !== 'Field') {
                throw new Error('Only field selections are currently supported.');
            }

            const selectionNode = schemaFields[selection.name.value];
            const fieldDirective = selectionNode.astNode.directives.find((dir: any) => dir.name.value === 'field');
            // @ts-ignore Only has one argument right now:
            const fieldNumber = parseInt(fieldDirective!.arguments[0].value.value, 10) - 1;

            s.f |= (1 << fieldNumber);

            if (selection.selectionSet) {
                if (!s.s) {
                    s.s = {};
                }

                if (!s.s[fieldNumber]) {
                    s.s[fieldNumber] = { f: 0 };
                }

                walkSelections(s.s[fieldNumber], selection, resolveType(schemaNode.getFields()[selection.name.value]));
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

    walkSelections(payload.s, operationDefinition as any, schema.getQueryType());

    return Buffer.from(
        encoder
            .encode(payload)
            .toString('hex'),
        'hex'
    );
}
