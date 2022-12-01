import React from "react"
import Button from "react-bootstrap/button"

export const ActionButton = ({bgColor, handleClick, label}) => {
    let style = {
        width:"40%", 
        height:"100px",
        background: bgColor
    }
    return <Button onClick={handleClick} 
        className="mt-2 text-dark" 
        style={style}>
            <h3>{label}</h3>
    </Button>
}
