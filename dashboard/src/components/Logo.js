import React from "react"

export const Logo = ({width, size, filter, className}) => {
    const classObj = className || `mr-2 ml-2`
    return <React.Fragment>
        <span className={`${size} website-color ${filter} logo`}>
            <img src={"https://assets.terminusdb.com/images/terminusx-color.png"} 
                className={classObj}
                width={width}/>
            <label className="fw-bold logo">TerminusCMS</label>
        </span>
    </React.Fragment>
}