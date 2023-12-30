import { createContext, useContext, useState } from "react";

export const HomeContext=createContext()

export const HomeContextProvider=({children})=>{
    const [isUpdateProfile,setIsUpdateProfile]=useState(false)
    const [isViewPhoto,setIsViewPhoto]=useState(false)
    const [isForwardMsg,setIsForwardMsg]=useState(false)
    const [forwardMsg,setForwardMsg]=useState('')

    const toggleUpdateProfile=()=>{
        setIsUpdateProfile(!isUpdateProfile)
    }
    const toggleViewPhoto=()=>{
        setIsViewPhoto(!isViewPhoto)
    }
    const toggleForwardMsg=()=>{
        setIsForwardMsg(!isForwardMsg)
    }
    const setForwardMsgText=(text)=>{
        setForwardMsg(text)
    }
    return(
        <HomeContext.Provider value={{isUpdateProfile,toggleUpdateProfile,isViewPhoto,toggleViewPhoto,isForwardMsg,toggleForwardMsg,forwardMsg,setForwardMsgText}}>
            {children}
        </HomeContext.Provider>
    )
}