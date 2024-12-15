import { sign, verify } from 'jsonwebtoken'

export const signToken = async (payload: any, expiration?: string) => {
    return sign(
        payload,
        process.env.JWT_SECRET,
        expiration ? { expiresIn: expiration } : {}
    )
}

export const verifyToken = async (token: string) => {
    try {
        return verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new Error(error)
    }
}

