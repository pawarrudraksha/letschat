import { createContext, useContext, useReducer, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext=createContext()

export const ChatContextProvider=({children})=>{
   const INTIAL_STATE={
        chatId:"",
        user:{}
   }
   const [isListen,setListener]=useState(false)
   const [lastMessage,setIsLastMessage]=useState('')
   const [secondLastMessage,setSecondLastMessage]=useState('')
   const [isEditMessage, setIsEditMessage] = useState({});

   const toggleIsEditMessages = (msgId) => {
    setIsEditMessage((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };   
   const toggleListener=()=>{
    setListener(!isListen)
   }
   const setLastMessage=(secondLastMessage,lastMessage)=>{
    setSecondLastMessage(secondLastMessage)
    setIsLastMessage(lastMessage)
   }

   const {currentUser}=useContext(AuthContext)
   const chatReducer=(state,action)=>{
        switch(action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload,
                    chatId: currentUser?.uid>state.user?.uid ? currentUser.uid + state.user?.uid : state.user?.uid + currentUser.uid
                }
            case "CLEAR_USER":
                return{
                    user: {},
                    chatId: ""
                }
            default:
                return state;
        }
   }
   const [state,dispatch]=useReducer(chatReducer,INTIAL_STATE)

    return(
        <ChatContext.Provider value={{data:state,dispatch,isListen,toggleListener,setLastMessage,lastMessage,secondLastMessage,isEditMessage,toggleIsEditMessages}}>
            {children}
        </ChatContext.Provider>
    )
}