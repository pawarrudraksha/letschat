import { createContext, useContext, useState } from "react";

export const HomeContext=createContext()

export const HomeContextProvider=({children})=>{
    const [isUpdateProfile,setIsUpdateProfile]=useState(false)
    const [isViewPhoto,setIsViewPhoto]=useState(false)

    const toggleUpdateProfile=()=>{
        setIsUpdateProfile(!isUpdateProfile)
    }
    const toggleViewPhoto=()=>{
        setIsViewPhoto(!isViewPhoto)
    }
    return(
        <HomeContext.Provider value={{isUpdateProfile,toggleUpdateProfile,isViewPhoto,toggleViewPhoto}}>
            {children}
        </HomeContext.Provider>
    )
}