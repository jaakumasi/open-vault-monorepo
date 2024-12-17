export const logger = (message: string, data?: object) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message, data ?? '')
    }
}