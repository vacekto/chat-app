export interface IUser {
    username: string
    email: string
    password: string
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export interface IResponseError {
    errorMessage: string,
    [props: string]: any
}

export interface IRegisterResponseData {
    username: string,
    email: string,
}

export interface ILoginResponseData {
    username: string,
    email: string,
    jwt: string
}