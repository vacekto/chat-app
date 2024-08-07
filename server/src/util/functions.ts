import { ITokenPayload, IUser, JWT_ACCESS_VALIDATION_LENGTH, JWT_REFRESH_VALIDATION_LENGTH, REFRESH_TOKEN_COOKIE } from '@chatapp/shared'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { COOKIE_SAMESITE } from './config'
import { IUserDB, TMongoDoc, TMongoLean } from '../types'

interface IGoogleTokenResult {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    id_token: string
}

export const getGoogleOAuthTokens = async (code: string): Promise<IGoogleTokenResult> => {
    const body = {
        code,
        client_id: process.env.VITE_GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.VITE_GOOGLE_OAUTH_REDIRECT_URL as string,
        grant_type: 'authorization_code'

    }
    const url = `https://oauth2.googleapis.com/token`
    const options: RequestInit = {
        method: "POST",
        body: JSON.stringify(body)
    }
    const res = await fetch(url, options)
    return res.json()
}

export const trimMongoObj = (obj: any, maxDepth = 10) => {
    if (typeof obj !== "object") return obj
    delete obj._id
    delete obj.__v

    maxDepth -= 1
    if (maxDepth === 0) return obj

    for (let prop in obj) {
        if (!(obj[prop] instanceof Array)) continue
        for (let item of obj[prop]) trimMongoObj(item, maxDepth)
    }
    return obj
}

export const signTokens = (payload: ITokenPayload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET as string,
        { expiresIn: JWT_ACCESS_VALIDATION_LENGTH }
    )

    const refreshToken = jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET as string,
        { expiresIn: JWT_REFRESH_VALIDATION_LENGTH }
    )

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

export const setRefreshTokenCookie = (
    res: Response<any, Record<string, any>>,
    refreshToken: string
) => {
    res.cookie(
        REFRESH_TOKEN_COOKIE,
        refreshToken,
        {
            httpOnly: true,
            sameSite: COOKIE_SAMESITE,
            maxAge: JWT_REFRESH_VALIDATION_LENGTH * 1000
        })
}

export const trimUserDB = (user: TMongoDoc<IUserDB> | TMongoLean<IUserDB> | IUserDB): IUser => {
    return {
        email: user.email,
        username: user.username,
        id: user.id
    }

}