import './App.css';
import { useState, useEffect } from "react";
import Header from "./components/Header.js";
import Grid from './components/Grid.js';
import Keyboard from "./components/Keyboard.js";
import Modal from "./components/Modal.js";

function App() {
  const WORD_LENGTH = 5;
  const NUMBER_OF_WORDS = 6;
  const COLOR_CODES = ["red", "yellow", "green"];
  const KEYS = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]

  const initializeGridContent = () => {
    let baseGridContent = [];
    let baseGridItem = {value: "", color: "gray"};
    for (let i = 0; i < NUMBER_OF_WORDS * WORD_LENGTH; i++) {
      baseGridContent.push({...baseGridItem});
    }
    return baseGridContent;
  }

  const initializeKeys = () => {
    let baseKeys = []
    for (let i = 0; i < 28; i++) {
      baseKeys.push({value: KEYS[i], color: "gray"});
    }
    return baseKeys;
  }

  const getRandomWord = async () => {
    const response = await fetch("/get_target");
    const data = await response.json();
    setTargetWord(data["target_word"]);
  }

  const resetEngine = async () => {
    const response = await fetch("/reset_engine");
    const data = await response.json();
    setTargetWord(data["target_word"]);
  }

  const handleSubmit = async () => {
    const response = await fetch(`/valid_word`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"word": attempt})
    })

    const data = await response.json()
    setIsValidWord(data["valid_word"])
    setFeedback(data["feedback"])
  }

  const getOptimalWord = async () => {
    const response = await fetch("/get_optimal_guess");
    const data = await response.json();
    setOptimalGuess(data["optimal_guess"]);
    setFeedback(data["feedback"]);
    setIsValidWord(true);
  }

  const [keys, setKeys] = useState(initializeKeys);
  const [gridContent, setGridContent] = useState(initializeGridContent());
  const [guessesSoFar, setGuessesSoFar] = useState(0);
  const [isValidWord, setIsValidWord] = useState(false);
  const [attempt, setAttempt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [showModalEnding, setShowModalEnding] = useState(false);
  const [showModalStart, setShowModalStart] = useState(true);
  const [targetWord, setTargetWord] = useState("");
  const [optimalGuess, setOptimalGuess] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [showModalBotEnd, setShowModalBotEnd] = useState(false);
  const handleType = async (key) => {
    if (gameMode === "user" && status === "In Progress") {
      if (attempt.length <= WORD_LENGTH) {
        if (key === "Backspace") {
          setCurrentLetter("DELETE");
        } else if (key === "Enter") {
          setCurrentLetter("ENTER");
        } else if ("qwertyuiopasdfghjklzxcvbnm".includes(key)) {
          if (attempt.length <= WORD_LENGTH - 1) {
            setCurrentLetter(key);
          }
        }
      }
    }
  }

  const handleKeyDown = async (e) => {
    await handleType(e.key);
  }

  useEffect(() => {
    if (currentLetter === "DELETE") {
      let newGrid = [...gridContent];
      let old_attempt = attempt;
      newGrid[guessesSoFar * WORD_LENGTH + old_attempt.length].value = "";
      setAttempt(attempt.slice(0, -1));
      setGridContent(newGrid);
    } else if (currentLetter === "ENTER") {
      if (attempt.length === WORD_LENGTH) {
        handleSubmit();
      }
    } else {
      setAttempt(attempt + currentLetter);
      let newGrid = [...gridContent];
      let old_attempt = attempt;
      if (guessesSoFar * WORD_LENGTH + old_attempt.length < NUMBER_OF_WORDS * WORD_LENGTH) {
        newGrid[guessesSoFar * WORD_LENGTH + old_attempt.length].value = currentLetter;
      }
      setGridContent(newGrid);
    }
    setCurrentLetter("");
  }, [currentLetter])

  const updateColorOfGrid = () => {
    let newGrid = [...gridContent];
    for (let i = 0; i < WORD_LENGTH; i++) {
      newGrid[guessesSoFar * WORD_LENGTH + i] = {
        ...newGrid[guessesSoFar * WORD_LENGTH + i],
        color: COLOR_CODES[Number(feedback[i])]
      }
    }
    setGridContent(newGrid);
  }

  const updateColorOfKeyboard = () => {
    let newKeys = [...keys];
    // find the index of the key with value attempt[i]
    for (let i = 0; i < attempt.length; i++) {
      let index = newKeys.findIndex(key => key.value === attempt[i]);
      newKeys[index] = {
        ...newKeys[index],
        color: COLOR_CODES[Number(feedback[i])]
      }
      setKeys(newKeys);
    }
  }

    useEffect(() => {
      if (gameMode === "user" && isValidWord) {
        if (feedback.every(num => num == 2) === false) {
          updateColorOfKeyboard();
          updateColorOfGrid();
          setAttempt("");
          setIsValidWord(false);
          setGuessesSoFar(guessesSoFar + 1);
        } else {
          updateColorOfKeyboard();
          updateColorOfGrid();
          setStatus("WON");
          setShowModalEnding(true);
        }
      }
    }, [isValidWord]);

    useEffect(() => {
      if (guessesSoFar === NUMBER_OF_WORDS) {
        setStatus("Game Over");
        setShowModalEnding(true);
      }
    }, [guessesSoFar]);


    useEffect(() => {
      if (gameMode === "user" && status === "In Progress") {
        console.log(gameMode)
        document.addEventListener('keydown', handleKeyDown);
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
      }
    }, [gameMode, status, attempt]);

    const handleCloseModal = (modalType) => {
      if (modalType === "start") {
        setShowModalStart(false);
      } else if (modalType === "end") {
        setShowModalEnding(false);
      } else if (modalType === "botEnd") {
        setShowModalBotEnd(false);
      }
    }

    const handleReset = async () => {
      await resetEngine();
      setKeys(initializeKeys);
      setGridContent(initializeGridContent());
      setGuessesSoFar(0);
      setIsValidWord(false);
      setAttempt("");
      setFeedback("");
      setCurrentLetter("");
      setStatus("In Progress");
      setTargetWord(getRandomWord());
      setOptimalGuess("");
      setGameMode("user");
      handleCloseModal("end");
    }

    const handleOptimalGuess = async () => {
      await getOptimalWord();
    }

    useEffect(() => {
      if (gameMode === "bot" && optimalGuess !== "") {
        let newGrid = [...gridContent];
        for (let i = 0; i < WORD_LENGTH; i++) {
          newGrid[guessesSoFar * WORD_LENGTH + i] = {
            ...newGrid[guessesSoFar * WORD_LENGTH + i],
            value: optimalGuess[i],
            color: COLOR_CODES[feedback[i]]
          }
          let newKeys = [...keys];
          // find the index of the key with value attempt[i]
          for (let i = 0; i < optimalGuess.length; i++) {
            let index = newKeys.findIndex(key => key.value === attempt[i]);
            newKeys[index] = {
              ...newKeys[index],
              color: COLOR_CODES[Number(feedback[i])]
            }
          }
          setKeys(newKeys);
          setGridContent(newGrid);
          setGuessesSoFar(guessesSoFar + 1);
          setIsValidWord(true);
        }
      }
    }, [optimalGuess]);

    const handleGameMode = async (typeOfGame) => {
      await handleReset();
      setGameMode(typeOfGame);
      setShowModalStart(false);
      setShowModalBotEnd(false);
  }

  useEffect(() => {
    if (gameMode === "bot" && status === "In Progress") {
      // if feedback contains exactly 2 of 5
      if (feedback !== "" && feedback.every(num => num == 2)) {
        setStatus("WON");
        setGuessesSoFar(guessesSoFar);
        setShowModalBotEnd(true);
      }
    }
  }, [guessesSoFar, feedback]);

    return (
        <div tabIndex={0} onKeyDown={handleKeyDown} className="App">
          {showModalStart && <Modal
              modalType="start"
              headerText={<h2>Welcome to Wordle!</h2>}
              pText={
                  <>
                    <p>Guess the Wordle in <strong> 6 </strong> tries.</p>
                    <ul>
                      <li> Each guess must be a valid 5-letter English word. </li>
                      <li> The color of the tiles will change to show how close your guess was to the word. </li>
                    </ul>
                    </>
          }
              handleReset={() => handleReset()}
              handleClose={() => handleCloseModal("start")}
              handleGameMode={handleGameMode}
          />}
          {showModalBotEnd && <Modal
                modalType="botEnd"
                handleClose={() => handleCloseModal("botEnd")}
                handleReset={() => handleReset()}
                headerText={<h2> Victory! </h2>}
                pText={<><p> The <strong> Wordle Bot </strong> guessed the word <strong>{targetWord}</strong> in only <strong>{guessesSoFar + 1}</strong> attempts!</p></>}
                handleGameMode={handleGameMode}/>
          }
          {showModalEnding && <Modal
              modalType="end"
              handleClose={() => handleCloseModal("end")}
              handleReset={() => handleReset()}
              headerText={status === "WON" ? <h2>Congratulations!</h2>: <h2>Game Over!</h2>}
              pText={status === "WON" ?
                  <p>You guessed the word <strong>{targetWord}</strong> in <strong>{guessesSoFar + 1}</strong> attempts!</p> :
                  <p>The word you had to guess was <strong>{targetWord}</strong>.</p>
              }
              handleGameMode={handleGameMode}
          />}
          <Header/>
          <div className="flex-container">
            {gameMode === "bot" && status === "In Progress" && <button onClick={handleOptimalGuess} className="guess-button"> Generate a new word! </button>}
            <Grid
                gridContent={gridContent}
            />
            <Keyboard keys={keys} handleType={handleType} gameMode={gameMode}/>
          </div>
        </div>
    );
}

export default App;
