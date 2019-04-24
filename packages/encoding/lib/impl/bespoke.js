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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import varint from 'varint';
import createIR from '../createIR';
// NOTE: Even though we never use 0, we still reserve it and don't use it for mutations to make it side-effect-free to zero-fill the buffer.
var TYPE_QUERY = 0;
var TYPE_MUTATION = 1;
var TYPE_SUBSCRIPTION = 2;
var FIELD_EXIT = 3;
var FIELD_ARGUMENT = 4;
// Use an enter offset to make it unambiguous with query (0) mutation (1) subscription (2) exit (3) and arguments (4)
var FIELD_ENTER_OFFSET = 6;
function stripTrailingExits(data) {
    var i = data.length - 1;
    while (data[i] === FIELD_EXIT) {
        data.splice(i, 1);
        i--;
    }
}
export function encode(schema, query, variables) {
    var data = [];
    function write(num) {
        if (Array.isArray(num)) {
            num.forEach(function (n) { return write(n); });
        }
        else {
            varint.encode(num).forEach(function (byte) {
                data.push(byte);
            });
        }
    }
    function walkIR(current) {
        var e_1, _a, e_2, _b;
        write(current.fields);
        if ('arguments' in current && current.arguments) {
            write(FIELD_ARGUMENT);
            try {
                for (var _c = __values(current.arguments), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var argument = _d.value;
                    write(argument.arg);
                    // TODO: Really should get better null handling:
                    write(argument.value ? argument.value.length : 0);
                    if (argument.value) {
                        write(__spread(argument.value));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (current.selections) {
            try {
                for (var _e = __values(current.selections), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var selection = _f.value;
                    write(FIELD_ENTER_OFFSET + selection.id);
                    walkIR(selection);
                    write(FIELD_EXIT);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    var ir = createIR(schema, query, variables, {
        getType: function (type) { return type; }
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
function decode(data) {
    var root = {};
    var offset = 0;
    function resolveField(selection) {
        if (selection === void 0) { selection = root; }
        selection.fields = varint.decode(data, offset);
        offset += varint.decode.bytes;
        if (data[offset]) {
            // We're pushing a field:
            if (data[offset] >= FIELD_ENTER_OFFSET) {
                selection.children = selection.children || {};
                var field = varint.decode(data, offset) - FIELD_ENTER_OFFSET;
                offset += varint.decode.bytes;
                selection.children[field] = {};
                resolveField(selection.children[field]);
            }
        }
    }
    resolveField();
    return root;
}
