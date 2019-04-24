import compress from 'graphql-query-compress';
export function encode(_schema, query, variables) {
    var obj = {
        query: compress(query)
    };
    if (variables) {
        obj.variables = variables;
    }
    return Buffer.from(JSON.stringify(obj));
}
export function decode(_schema, blob) {
    return JSON.parse(blob.toString('utf8'));
}
