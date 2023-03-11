import './Modal.css';

const Modal = ({ modalType, headerText, pText, handleGameMode }) => {
    return (
        <div className="modal">
        <div className="modal-content">
            {headerText}
            {pText}
            <div className='button-container'>
                {modalType !== "start" && <span>Play again?</span>}
                {<button onClick={() => handleGameMode("bot")}>Play with Bot</button>}
                {<button onClick={() => handleGameMode("user")}>Play by Yourself</button>}
            </div>
        </div>
        </div>
    );
}

export default Modal;