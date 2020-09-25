export const USER_AUTH_ERROR = 'USER_AUTH_ERROR'



export interface ISignUpParams {
    email: string,
    password: string,
    name: string,
    profilePic: any,
    username: string
}

export interface ISignInParams {
    email: string,
    password: string
}

export interface IEditProfileParams {
    name: string,
    username: string,
    profilePic: any
}