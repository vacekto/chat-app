import { TUtilMiddleware } from "../types";
import * as MongoAPI from '../Mongo/API'
import { ILoginResponseData, zodSchemas, IRegisterResponseData, TTokenPayload, getJWTPayload } from '@chatapp/shared'
import BadUserInput from "../util/errorClasses/BadUserInput";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { redisClient } from "../Redis/connect";

export const register: TUtilMiddleware = async (req, res, next) => {
    const registerData = zodSchemas.registerApiZS.parse(req.body)
    const createdUser = await MongoAPI.createUser(registerData)
    const POJO: IRegisterResponseData = {
        username: createdUser.username,
        email: createdUser.email
    }
    res.send(POJO)
}

export const login: TUtilMiddleware = async (req, res) => {
    const loginData = zodSchemas.loginApiZS.parse(req.body)
    const user = await MongoAPI.getUser({ username: loginData.username })
    if (!user) throw new BadUserInput(`User with username ${loginData.username} does not exist.`)
    const isMatch = await bcrypt.compare(loginData.password, user.password)
    if (!isMatch) throw new BadUserInput('Incorrect password')
    const payload = {
        username: user.username,
        email: user.email
    }
    const accessToken = jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET as string,
        { expiresIn: 600 }
    )
    const refreshToken = jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET as string,
        { expiresIn: 604800 }
    )
    res.cookie(
        "chatAppRefreshToken",
        refreshToken,
        {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 604800000
        })
    await redisClient.set(user.username, refreshToken);
    const userData: ILoginResponseData = {
        username: user.username,
        email: user.email,
        jwt: accessToken
    }
    res.send(userData)
}

export const refreshToken: TUtilMiddleware = async (req, res) => {
    const refreshToken = req.cookies["chatAppRefreshToken"]
    if (!refreshToken) {
        res.status(400).send()
        return
    }
    jwt.verify(
        refreshToken,
        process.env.AUTH_TOKEN_SECRET as string,
    )
    let payload: TTokenPayload = getJWTPayload(refreshToken)
    payload = {
        username: payload.username,
        email: payload.email
    }
    const redisRefreshToken = await redisClient.get(payload.username);
    if (refreshToken !== redisRefreshToken) {
        res.clearCookie("chatAppRefreshToken")
        res.redirect('back')
        return
    }
    const newAccessToken = jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET as string,
        { expiresIn: 600 }
    )
    const newRefreshToken = jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET as string,
        { expiresIn: 604800 }
    )
    res.cookie(
        "chatAppRefreshToken",
        newRefreshToken,
        {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 604800000
        })
    await redisClient.set(payload.username, newRefreshToken);
    res.send({ JWT: newAccessToken })
}

export const logout: TUtilMiddleware = async (req, res) => {
    const token = req.cookies["chatAppRefreshToken"]
    const paylaod: TTokenPayload = getJWTPayload(token)
    res.clearCookie("chatAppRefreshToken")
    await redisClient.del(paylaod.username);
    res.status(200).send(paylaod)
}

export const test: TUtilMiddleware = async (req, res, next) => {
    console.log("testing")
    res.status(200).send('test route hit')
}