import { userContextAction, userContextStateType } from "../ContextTypes";

export const initialUserContextState : userContextStateType = {
    isAuthenticated : false,
    user : undefined
}

export const userContextActionsType = {
    signUp : 'SIGN_UP',
    signIn : 'SIGN_IN',
    signOut : 'SIGN_OUT'
}

export const userContextReducer = (state : userContextStateType,action : userContextAction) : userContextStateType => {
    switch(action.type){
        case userContextActionsType.signIn : return {
            ...state,
            user : action.payload!,
            isAuthenticated : true
        }
        case userContextActionsType.signOut : return initialUserContextState
        default : return initialUserContextState
    }
}