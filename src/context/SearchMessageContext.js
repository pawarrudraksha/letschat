import { createContext, useState } from "react";

export const SearchMessageContext=createContext()

export const SearchMessageContextProvider=({children})=>{
    const [isSearchBarOpen,setIsSearchBarOpen]=useState(false)
    const [selectedMessageId,setSelectedMessageId]=useState("")
    const toggleSearchBar=()=>{
        setIsSearchBarOpen(!isSearchBarOpen)
    }
    const setMessageId=(msgId)=>{
        setSelectedMessageId(msgId)
    }
    const clearMessageId=(msgId)=>{
        setSelectedMessageId("")
    }
    return(
        <SearchMessageContext.Provider value={{isSearchBarOpen,toggleSearchBar,selectedMessageId,setMessageId,clearMessageId}}>
            {children}
        </SearchMessageContext.Provider>
    )
}