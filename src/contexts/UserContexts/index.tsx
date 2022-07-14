import React, { createContext, useContext, useReducer } from 'react'
import { initialUserContextState, userContextReducer } from './UserContextReducer';
import { userContextType } from '../ContextTypes'



const userContext = createContext<userContextType>({
  state : initialUserContextState,
  dispatch : ()=>null
})

export const useUserContext = ()=> useContext(userContext);

const UserContext : React.FC = ({children}) => {
  const [state, dispatch] = useReducer(userContextReducer, initialUserContextState)
  
  return (
    <userContext.Provider value={{state,dispatch}}>
      {children}
    </userContext.Provider>
  )
}

export default UserContext