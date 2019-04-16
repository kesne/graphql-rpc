export class Protocol {
    constructor(name: any, messages: any, types: any, ptcl: any);
    createEmitter(transport: any, opts: any, cb: any): any;
    createListener(transport: any, opts: any, cb: any): any;
    emit(name: any, req: any, emitter: any, cb: any): void;
    getMessages(): any;
    getName(): any;
    getType(name: any): any;
    inspect(): any;
    on(name: any, handler: any): any;
    subprotocol(): any;
}
export function ProtocolValidator(args: any): any;
export namespace ProtocolValidator {
    function validate(protocol: any, typeName: any, obj: any): any;
}
export const Type: any;
export function Validator(args: any): any;
export namespace Validator {
    function validate(schema: any, obj: any): any;
}
export function createFileDecoder(path: any, opts: any): any;
export function createFileEncoder(path: any, schema: any, opts: any): any;
export function extractFileHeader(path: any, opts: any): any;
export function parse(schema: any, opts?: any): any;
export namespace streams {
    class BlockDecoder {
        static getDefaultCodecs(): any;
        constructor(opts: any);
        addListener(ev: any, fn: any): any;
        cork(): void;
        destroy(err: any, cb: any): any;
        emit(type: any, args: any): any;
        end(chunk: any, encoding: any, cb: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        isPaused(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(ev: any, fn: any): any;
        once(type: any, listener: any): any;
        pause(): any;
        pipe(dest: any, pipeOpts: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        push(chunk: any, encoding: any): any;
        rawListeners(type: any): any;
        read(n: any): any;
        removeAllListeners(ev: any): any;
        removeListener(ev: any, fn: any): any;
        resume(): any;
        setDefaultEncoding(encoding: any): any;
        setEncoding(enc: any): any;
        setMaxListeners(n: any): any;
        uncork(): void;
        unpipe(dest: any): any;
        unshift(chunk: any): any;
        wrap(stream: any): any;
        write(chunk: any, encoding: any, cb: any): any;
    }
    class BlockEncoder {
        static getDefaultCodecs(): any;
        constructor(schema: any, opts: any);
        addListener(ev: any, fn: any): any;
        cork(): void;
        destroy(err: any, cb: any): any;
        emit(type: any, args: any): any;
        end(chunk: any, encoding: any, cb: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        isPaused(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(ev: any, fn: any): any;
        once(type: any, listener: any): any;
        pause(): any;
        pipe(dest: any, pipeOpts: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        push(chunk: any, encoding: any): any;
        rawListeners(type: any): any;
        read(n: any): any;
        removeAllListeners(ev: any): any;
        removeListener(ev: any, fn: any): any;
        resume(): any;
        setDefaultEncoding(encoding: any): any;
        setEncoding(enc: any): any;
        setMaxListeners(n: any): any;
        uncork(): void;
        unpipe(dest: any): any;
        unshift(chunk: any): any;
        wrap(stream: any): any;
        write(chunk: any, encoding: any, cb: any): any;
    }
    class RawDecoder {
        constructor(schema: any, opts: any);
        addListener(ev: any, fn: any): any;
        cork(): void;
        destroy(err: any, cb: any): any;
        emit(type: any, args: any): any;
        end(chunk: any, encoding: any, cb: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        isPaused(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(ev: any, fn: any): any;
        once(type: any, listener: any): any;
        pause(): any;
        pipe(dest: any, pipeOpts: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        push(chunk: any, encoding: any): any;
        rawListeners(type: any): any;
        read(n: any): any;
        removeAllListeners(ev: any): any;
        removeListener(ev: any, fn: any): any;
        resume(): any;
        setDefaultEncoding(encoding: any): any;
        setEncoding(enc: any): any;
        setMaxListeners(n: any): any;
        uncork(): void;
        unpipe(dest: any): any;
        unshift(chunk: any): any;
        wrap(stream: any): any;
        write(chunk: any, encoding: any, cb: any): any;
    }
    class RawEncoder {
        constructor(schema: any, opts: any);
        addListener(ev: any, fn: any): any;
        cork(): void;
        destroy(err: any, cb: any): any;
        emit(type: any, args: any): any;
        end(chunk: any, encoding: any, cb: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        isPaused(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(ev: any, fn: any): any;
        once(type: any, listener: any): any;
        pause(): any;
        pipe(dest: any, pipeOpts: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        push(chunk: any, encoding: any): any;
        rawListeners(type: any): any;
        read(n: any): any;
        removeAllListeners(ev: any): any;
        removeListener(ev: any, fn: any): any;
        resume(): any;
        setDefaultEncoding(encoding: any): any;
        setEncoding(enc: any): any;
        setMaxListeners(n: any): any;
        uncork(): void;
        unpipe(dest: any): any;
        unshift(chunk: any): any;
        wrap(stream: any): any;
        write(chunk: any, encoding: any, cb: any): any;
    }
}
export namespace types {
    class ArrayType {
        constructor(attrs: any, opts: any);
        clone(val: any, opts: any): any;
        compare(val1: any, val2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getItemsType(): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class BooleanType {
        clone(val: any, opts: any): any;
        compare(n1: any, n2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class BytesType {
        clone(val: any, opts: any): any;
        compare(buf1: any, buf2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class DoubleType {
        clone(val: any, opts: any): any;
        compare(n1: any, n2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class EnumType {
        constructor(attrs: any, opts: any);
        clone(val: any, opts: any): any;
        compare(val1: any, val2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getAliases(): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        getSymbols(): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class FixedType {
        constructor(attrs: any, opts: any);
        clone(val: any, opts: any): any;
        compare(buf1: any, buf2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getAliases(): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        getSize(): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class FloatType {
        clone(val: any, opts: any): any;
        compare(n1: any, n2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class IntType {
        clone(val: any, opts: any): any;
        compare(n1: any, n2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class LogicalType {
        constructor(attrs: any, opts: any, Types: any);
        clone(val: any, opts: any): any;
        compare(obj1: any, obj2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        getUnderlyingType(): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class LongType {
        static using(methods: any, noUnpack: any): any;
        clone(val: any, opts: any): any;
        compare(n1: any, n2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class MapType {
        constructor(attrs: any, opts: any);
        clone(val: any, opts: any): any;
        compare(): void;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        getValuesType(): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class NullType {
        clone(val: any, opts: any): any;
        compare(): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class RecordType {
        constructor(attrs: any, opts: any);
        clone(val: any, opts: any): any;
        compare(val1: any, val2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getAliases(): any;
        getFields(): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getRecordConstructor(): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class StringType {
        clone(val: any, opts: any): any;
        compare(n1: any, n2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
    class Type {
        constructor(registry: any);
        clone(val: any, opts: any): any;
        compare(): void;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): void;
        toBuffer(val: any): any;
        toString(val: any): any;
    }
    class UnionType {
        constructor(attrs: any, opts: any);
        clone(val: any, opts: any): any;
        compare(val1: any, val2: any): any;
        compareBuffers(buf1: any, buf2: any): any;
        createResolver(type: any, opts: any): any;
        decode(buf: any, pos: any, resolver: any): any;
        encode(val: any, buf: any, pos: any): any;
        fromBuffer(buf: any, resolver: any, noCheck: any): any;
        fromString(str: any): any;
        getFingerprint(algorithm: any): any;
        getName(noRef: any): any;
        getSchema(noDeref: any): any;
        getTypes(): any;
        inspect(): any;
        isValid(val: any, opts: any): any;
        random(): any;
        toBuffer(val: any): any;
        toJSON(): any;
        toString(val: any): any;
    }
}
