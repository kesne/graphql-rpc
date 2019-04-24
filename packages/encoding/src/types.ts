export type Variables = Record<string, any> | undefined | null;

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

export type RootIR<Type = any> = {
    type: Type;
    fields: number;
    selections?: ChildIR[];
};

export type IR<Type = any> = RootIR<Type> | ChildIR | ArgumentIR;
