import React , {useState,useEffect,useContext} from 'react'
export const BrowseContext = React.createContext()
export const BrowseObj = () => useContext(BrowseContext)
 
export const BrowseContextProvider = ({children}) => {
    const [currentDocument, setCurrentDocument]=useState("Theme")
    const [themeID, setThemeID]=useState(false)

    return (
        <BrowseContext.Provider
            value={{
                currentDocument,
                setCurrentDocument,
                themeID, 
                setThemeID
            }}
        >
            {children}
        </BrowseContext.Provider>
    )
}

