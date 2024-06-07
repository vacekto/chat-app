import { IMessage } from "./custom";

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    message: (msg: IMessage) => void
    usersUpdate: (users: string[]) => void
    test: () => void
}

export interface ClientToServerEvents {
    hello: () => void;
    message: (msg: IMessage) => void
    test: () => void
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    username: string;
}