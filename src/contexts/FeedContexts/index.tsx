import React, { createContext, useContext, useReducer } from 'react'
import { feedContextType } from '../ContextTypes'
import { feedContextReducer, initialFeedContextState } from './FeedContextReducer'


const feedContext = createContext<feedContextType>({
    state : initialFeedContextState,
    dispatch : ()=>null
})

export const useFeedContext = ()=> useContext(feedContext);


const FeedContext : React.FC = ({children}) => {
    const [state, dispatch] = useReducer(feedContextReducer, initialFeedContextState)
  return (
    <feedContext.Provider value={{state,dispatch}}>
      {children}
    </feedContext.Provider>
  )
}

export default FeedContext