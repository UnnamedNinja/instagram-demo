const initState = {
    authError: undefined,
    postError: undefined
}

interface IAction {
    type: string,
    err?: object
}

const appReducer = (state = initState, action: IAction) => {
    switch (action.type) {
        case 'USER_AUTH_ERROR':
            return {
                ...state,
                authError: action.err
            }
        case 'POST_ERROR':
            return {
                ...state,
                postError: action.err
            }
        default:
            return state
    }
}

export default appReducer
