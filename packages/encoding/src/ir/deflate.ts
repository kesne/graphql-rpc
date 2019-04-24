import { GraphQLSchema, print, parse } from 'graphql';
import { Variables, RootIR, ChildIR } from '../types';

type Deflated = {
    query: string;
    variables: Variables;
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

function walkSelections(ir: ChildIR, deflated: any, schemaNode: any) {
    if (ir.arguments) {
        deflated.arguments = {};

        ir.arguments.forEach(({ arg, value }) => {
            deflated.arguments[schemaNode.args[arg].name] = value
                ? JSON.parse(value.toString())
                : null;
        });
    }

    // NOTE: Need this because Long.js is used in Protobuf. Need to consistently encode as string.
    if (ir.fields.toString() !== '0') {
        deflated.selections = {};

        const schemaFields = resolveType(schemaNode).getFields();
        const queryFieldKeys = Object.keys(schemaFields);

        [...ir.fields.toString(2)].reverse().forEach((shouldSelect, index) => {
            // Just ignore things we're not selecting:
            if (shouldSelect === '0') return;

            const fieldName = queryFieldKeys[index];
            const childSelections = ir.selections && ir.selections.find(({ id }) => id === index);
            if (childSelections) {
                deflated.selections[fieldName] = {};
                walkSelections(
                    childSelections,
                    deflated.selections[fieldName],
                    schemaFields[fieldName]
                );
            } else {
                deflated.selections[fieldName] = true;
            }
        });
    }
}

function writeField(key: string, deflated: any, vars: any[]) {
    if (deflated.arguments && Object.keys(deflated.arguments).length) {
        return `${key}(${Object.entries(deflated.arguments).reduce((acc, [akey, aval]) => {
            const idx = vars.push(aval);
            return [acc, `${akey}: $v${idx}`].join(' ');
        }, '')})`;
    }

    return key;
}

function writeDeflated(deflated: { selections: Record<string, any> | true }, vars: any[]): string {
    return Object.entries(deflated.selections).reduce((acc, [key, selection]) => {
        if (!selection.selections) {
            return [acc, writeField(key, selection, vars)].join(' ');
        }

        return [acc, writeField(key, selection, vars), '{', writeDeflated(selection, vars), '}'].join(' ');
    }, '');
}

export default function deflate<Type>(
    schema: GraphQLSchema,
    ir: RootIR<Type>,
    builder: {
        getType(type: Type): 'mutation' | 'subscription' | 'query';
    }
): Deflated {
    const deflated: any = {
        selections: {}
    };

    walkSelections((ir as unknown) as ChildIR, deflated, schema.getQueryType());

    const vars: any[] = [];

    console.log(`
    ${builder.getType(ir.type)} {
        ${writeDeflated(deflated, vars)}
    }
`);
    return {
        query: print(
            parse(`
            ${builder.getType(ir.type)} {
                ${writeDeflated(deflated, vars)}
            }
        `)
        ),
        variables: {}
    };
}
