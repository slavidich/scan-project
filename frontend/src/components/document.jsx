import React from "react";

function document(props){
    const data = props.data
    return(<div>
        <p>№ {props.index}</p>
        <h3>{data.title}</h3>
    </div>)
}

export default document