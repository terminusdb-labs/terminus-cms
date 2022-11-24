import React from "react"

export const Logo = ({width, size, filter}) => {
    return <React.Fragment>
        <span className={`${size} website-color ${filter} logo`}>
            <img src={"https://assets.terminusdb.com/images/terminusx-color.png"} 
                className={`mr-2 ml-5`}
                width={width}/>
            <label className="fw-bold logo">TerminusCMS</label>
        </span>
    </React.Fragment>
}