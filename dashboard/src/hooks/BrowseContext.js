import React , {useState,useEffect,useContext} from 'react'
export const BrowseContext = React.createContext()
export const BrowseObj = () => useContext(BrowseContext)
import {THEME} from "../components/constants"
 
export const BrowseContextProvider = ({children}) => {
    const [currentDocument, setCurrentDocument]=useState(THEME)
    const [themeID, setThemeID]=useState(false)
    const [loading, setLoading]=useState(false)

    return (
        <BrowseContext.Provider
            value={{
                currentDocument,
                setCurrentDocument,
                themeID, 
                setThemeID,
                loading, 
                setLoading
            }}
        >
            {children}
        </BrowseContext.Provider>
    )
}

