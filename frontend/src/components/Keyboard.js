import React from "react";
import './Keyboard.css'

const Keyboard = ({ keys, handleType, gameMode }) => {
    let keyboardItemsFirst = [];
    for (let i = 0; i < 10; i++) {
        keyboardItemsFirst.push(<button 
            key={i}
            className={`keyboard-item ${keys[i].color}`}
            onClick={() => handleType(keys[i].value)}
            disabled={gameMode === "bot"}
        >{keys[i].value.toUpperCase()}</button>);
    }
    let keyboardItemsSecond = [];
    for (let i = 10; i < 19; i++) {
        keyboardItemsSecond.push(<button 
            key={i}
            className={`keyboard-item ${keys[i].color}`}
            onClick={() => handleType(keys[i].value)}
            disabled={gameMode === "bot"}
        >{keys[i].value.toUpperCase()}</button>);
    }
    let keyboardItemsThird = [];
    for (let i = 19; i < 28; i++) {
        keyboardItemsThird.push(<button 
            key={i}
            className={i === 19 || i === 27 ? "keyboard-item big-button" : `keyboard-item ${keys[i].color}`}
            onClick={() => handleType(keys[i].value)}
            disabled={gameMode === "bot"}
        >{i === 19 || i === 27 ? keys[i].value : keys[i].value.toUpperCase()}</button>);
    }
    return (
    <div className={"keyboard"}>
        <div className="keyboard-flex-container">
            <div className="first-row">
                {keyboardItemsFirst}
            </div>
            <div className={"second-row"}>
                {keyboardItemsSecond}
            </div>
            <div className={"third-row"}>
                {keyboardItemsThird}
            </div>
        </div>
    </div>
    )
}

export default Keyboard;