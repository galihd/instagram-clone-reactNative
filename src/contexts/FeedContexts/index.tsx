import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react'
import { feedContextType } from '../ContextTypes'
import { useUserContext } from '../UserContexts';
import { setPosts } from './FeedContextAction';
import { feedContextReducer, initialFeedContextState } from './FeedContextReducer'


const feedContext = createContext<feedContextType>({
    state : initialFeedContextState,
    dispatch : ()=>null
})

export const useFeedContext = ()=> useContext(feedContext);


const FeedContext : React.FC<{children? : ReactNode}> = ({children}) => {
    const [state, dispatch] = useReducer(feedContextReducer, initialFeedContextState)
    const userContext = useUserContext();
    useEffect(() => {
      if(userContext.state.isAuthenticated && userContext.state.user)
        setPosts(userContext.state.user.appUserId).then(dispatch)
      return () => {
        
      }
    }, [userContext.state.isAuthenticated])
    
    
  return (
    <feedContext.Provider value={{state,dispatch}}>
      {children}
    </feedContext.Provider>
  )
}

export default FeedContext