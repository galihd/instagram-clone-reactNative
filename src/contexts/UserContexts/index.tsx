import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { initialUserContextState, userContextReducer } from './UserContextReducer';
import { userContextType } from '../ContextTypes'
import { setPosts, setRelation } from './UserContextAction';



const userContext = createContext<userContextType>({
  state : initialUserContextState,
  dispatch : ()=>null
})

export const useUserContext = ()=> useContext(userContext);

const UserContext : React.FC = ({children}) => {
  const [state, dispatch] = useReducer(userContextReducer, initialUserContextState)

  useEffect(()=>{
    if(state.user && state.isAuthenticated){
      setRelation(state.user.appUserId).then(dispatch)
      setPosts(state.user.appUserId).then(dispatch)
    }
  },[state.user])
  
  return (
    <userContext.Provider value={{state,dispatch}}>
      {children}
    </userContext.Provider>
  )
}

export default UserContext