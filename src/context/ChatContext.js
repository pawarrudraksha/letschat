import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext=createContext()

export const ChatContextProvider=({children})=>{
   const INTIAL_STATE={
        chatId:"null",
        user:{}
   }
   const {currentUser}=useContext(AuthContext)
   const chatReducer=(state,action)=>{
        switch(action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload,
                    chatId: currentUser?.uid>state.user?.uid ? currentUser.uid + state.user?.uid : state.user?.uid + currentUser.uid
                }
            default:
                return state;
        }
   }
   const [state,dispatch]=useReducer(chatReducer,INTIAL_STATE)

    return(
        <ChatContext.Provider value={{data:state,dispatch}}>
            {children}
        </ChatContext.Provider>
    )
}