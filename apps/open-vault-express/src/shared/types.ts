export interface ResponseObject {
    statusCode: number;
    message: string;
    data?: object;
}

export type UserRole = "user" | "superUser"

export interface JWTPayload {
    data: {
        id: string,
        role: UserRole
    }
}

export type VerificationScenario = "passwordReset" | "formSignup" | "socialSignup"
