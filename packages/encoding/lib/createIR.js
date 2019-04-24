var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import { parse } from 'graphql';
function resolveType(node) {
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
// NOTE: Uncomment to use directive-based numbering:
// function getFieldNumber(node: FieldNode | InputValueDefinitionNode) {
// if (!node.directives) {
//     throw new Error(`No directives found on node ${node.name.value}`);
// }
// const fieldDirective = node.directives.find(dir => dir.name.value === 'field');
// if (!fieldDirective) {
//     throw new Error(`No "field" directive found on node ${node.name.value}`);
// }
// // @ts-ignore Only ever has one argument right now:
// return parseInt(fieldDirective.arguments[0].value.value, 10) - 1;
// }
function getArgumentValue(argument, variables) {
    var resolvedValue = argument.value.kind === 'Variable'
        ? variables && variables[argument.value.name.value]
        : argument.value.kind === 'NullValue'
            ? null
            : // TODO: Need more comprehensive argument checks:
                argument.value.value;
    return resolvedValue ? Buffer.from(JSON.stringify(resolvedValue)) : null;
}
function walkSelections(ir, node, schemaNode, variables) {
    var e_1, _a;
    if (node.arguments && node.arguments.length) {
        ir.arguments = ir.arguments || [];
        var _loop_1 = function (argument) {
            var argNumber = schemaNode.args.findIndex(function (arg) { return arg.name === argument.name.value; });
            // NOTE: Uncomment to use directive-based numbering:
            // const argNode = schemaNode.args.find((arg: any) => arg.name === argument.name.value);
            // const argNumber = getFieldNumber(argNode.astNode);
            ir.arguments.push({
                arg: argNumber,
                value: getArgumentValue(argument, variables)
            });
        };
        try {
            for (var _b = __values(node.arguments), _c = _b.next(); !_c.done; _c = _b.next()) {
                var argument = _c.value;
                _loop_1(argument);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    if (node.selectionSet) {
        var schemaFields_1 = resolveType(schemaNode).getFields();
        node.selectionSet.selections.forEach(function (selection) {
            if (selection.kind !== 'Field') {
                throw new Error('Only field selections are currently supported.');
            }
            var fieldNode = schemaFields_1[selection.name.value];
            var fieldNumber = Object.keys(schemaFields_1).findIndex(function (field) { return field === selection.name.value; });
            // NOTE: Uncomment to use directive-based numbering:
            // const fieldNumber = getFieldNumber(fieldNode.astNode);
            ir.fields |= 1 << fieldNumber;
            // If there are arguments or selections, we need to create a dedicated node:
            if (selection.selectionSet || (selection.arguments && selection.arguments.length)) {
                ir.selections = ir.selections || [];
                var nextIr = { id: fieldNumber, fields: 0 };
                ir.selections.push(nextIr);
                walkSelections(nextIr, selection, fieldNode, variables);
            }
        });
    }
}
export default function createIR(schema, query, variables, builder) {
    var parsedQuery = parse(query);
    var operationDefinition = parsedQuery.definitions[0];
    var root = {
        type: builder.getType(operationDefinition.operation),
        fields: 0
    };
    walkSelections(root, operationDefinition, schema.getQueryType(), variables);
    return root;
}
