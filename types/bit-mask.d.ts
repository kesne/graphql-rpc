declare module 'bit-mask' {
    export default class BitMask {
        constructor(value?: number, base?: number);
        setBit(position: number, value: boolean): void;
        bits(): string;
    }
}
