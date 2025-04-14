import firstResponse from "./firstResponse";
export interface errorResponse extends firstResponse  {
    status?: string,
    stack?: string,
    error?: CustomError
} 
export interface CustomError extends Error {   // message and stack and name exists in Error
    status?: string,
    statusCode: number,
    isOperational?: boolean,
    path?: string,
    value?: string
    code?: number,
    errmsg?: string,
    errors?: object
}

