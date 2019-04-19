import {
    GraphQLSchema,
    parse,
    FieldNode,
    InputValueDefinitionNode,
    ArgumentNode,
    OperationDefinitionNode
} from 'graphql';
import { Variables } from './types';

export type ArgumentIR = {
    arg: number;
    value: Buffer | null;
};

export type ChildIR = {
    id: number;
    fields: number;
    arguments?: ArgumentIR[];
    selections?: ChildIR[];
};

export type IR<Type = any> = {
    type: Type;
    fields: number;
    selections?: ChildIR[];
};

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

function getArgumentValue(argument: ArgumentNode, variables?: Variables) {
    const resolvedValue =
        argument.value.kind === 'Variable'
            ? variables && variables[argument.value.name.value]
            : argument.value.kind === 'NullValue'
            ? null
            : // TODO: Need more comprehensive argument checks:
              (argument.value as any).value;

    return resolvedValue ? Buffer.from(JSON.stringify(resolvedValue)) : null;
}

function walkSelections(ir: ChildIR, node: FieldNode, schemaNode: any, variables?: Variables) {
    if (node.arguments && node.arguments.length) {
        ir.arguments = ir.arguments || [];

        for (const argument of node.arguments) {
            const argNode = schemaNode.args.find((arg: any) => arg.name === argument.name.value);
            const argNumber = getFieldNumber(argNode.astNode);

            ir.arguments.push({
                arg: argNumber,
                value: getArgumentValue(argument, variables)
            });
        }
    }

    if (node.selectionSet) {
        const schemaFields = resolveType(schemaNode).getFields();
        node.selectionSet.selections.forEach(selection => {
            if (selection.kind !== 'Field') {
                throw new Error('Only field selections are currently supported.');
            }

            const fieldNode = schemaFields[selection.name.value];
            const fieldNumber = getFieldNumber(fieldNode.astNode);

            ir.fields |= 1 << fieldNumber;

            // If there are arguments or selections, we need to create a dedicated node:
            if (selection.selectionSet || (selection.arguments && selection.arguments.length)) {
                ir.selections = ir.selections || [];

                const nextIr: ChildIR = { id: fieldNumber, fields: 0 };
                ir.selections.push(nextIr);

                walkSelections(nextIr, selection, fieldNode, variables);
            }
        });
    }
}

export default function createIR<Type>(
    schema: GraphQLSchema,
    query: string,
    variables: Variables,
    builder: {
        getType(type: 'mutation' | 'subscription' | 'query'): Type;
    }
): IR<Type> {
    const parsedQuery = parse(query);
    const operationDefinition = parsedQuery.definitions[0] as OperationDefinitionNode;

    const root: IR<Type> = {
        type: builder.getType(operationDefinition.operation),
        fields: 0
    };

    walkSelections(
        (root as unknown) as ChildIR,
        (operationDefinition as unknown) as FieldNode,
        schema.getQueryType(),
        variables
    );

    return root;
}
