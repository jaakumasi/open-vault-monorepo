import { sign, verify } from 'jsonwebtoken'

export const signToken = async (payload: object, expiration?: string) => {
    return sign(
        payload,
        process.env.JWT_SECRET,
        expiration ? { expiresIn: expiration } : {}
    )
}

export const verifyToken = async (token: string) => {
    try {
        const decodedToken = verify(token, process.env.JWT_SECRET)
        return decodedToken
    } catch (error) {
        throw new Error(error)
    }
}

