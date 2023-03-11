import React from "react";
import './Grid.css';

const Grid = ({ gridContent }) => {
    let gridItems = [];
    for (let i = 0; i < 30; i++) {
        gridItems.push(<div 
            key={i} 
            className={`grid-item ${gridContent[i].color}`}>{gridContent[i].value.toUpperCase()}</div>);
    }
    return (
        <>
            <div className="grid-container">
                <div className="grid">
                    {gridItems}
                </div>
            </div>
        </>
    )
}

export default Grid;