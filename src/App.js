import axios from "axios";
import {useState} from "react";
import DungeonDisplay from "./components/DungeonDisplay/DungeonDisplay";
import ReactModal from 'react-modal';

const server = "https://7fb1-68-82-117-156.ngrok-free.app"

//const server = "http://localhost:5000";
function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNextLevel, setIsLoadingNextLevel] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [isNextLevelAvailable, setIsNextLevelAvailable] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [lastLevelCleared, setLastLevelCleared] = useState(0);
    const [combatLog, setCombatLog] = useState([]);
    const [gameState, setGameState] = useState({
        game: null,
        palette: {background_colors: [], text_colors: []},
    });


    async function createNewGame() {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/new-game`, {playerName});
            setGameState({
                game: res.data,
                palette: res.data.level.dungeon.color_palette,
            });
            setGameStarted(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleMove(direction) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/move`, {game_id: gameState.game.id, direction});
            if (res.data.player_square_contents === 'X') {
                setGameState((prevState) => ({...prevState, game: res.data}));
                setIsNextLevelAvailable(true);
            } else {
                setGameState((prevState) => ({...prevState, game: res.data}));
                setIsNextLevelAvailable(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function getNextLevel() {
        setIsLoading(true);
        setIsLoadingNextLevel(true);
        try {
            const res = await axios.post(`${server}/next-level`, {game_id: gameState.game.id});
            setGameState({
                game: res.data,
                palette: res.data.level.dungeon.color_palette,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsLoadingNextLevel(false);
        }
    }

    async function handleAttack(monsterId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/attack`, {
                game_id: gameState.game.id,
                monster_id: monsterId
            });
            if (res.data.message === 'Game Over') {
                setIsGameOver(true);
                setLastLevelCleared(res.data.last_level_cleared)
                setCombatLog(res.data.combat_log);
                setGameStarted(false);
                setPlayerName(''); // Reset player name
                return;
            }
            setGameState((prevState) => ({...prevState, game: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleEquipItem(item, gameId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/equip-item`, {item, gameId});
            setGameState((prevState) => ({...prevState, game: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePackItem(item, gameId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/pack-item`, {item, gameId});
            setGameState((prevState) => ({...prevState, game: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleHeal(gameId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/heal`, {game_id:gameId});
            setGameState((prevState) => ({...prevState, game: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="App bg-gradient-to-r from-black to-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
            <header className="App-header mb-8">
                <h1 className="text-6xl font-bold">Abyssal Infinity</h1>
            </header>
            {gameStarted ?
                <>
                    {<DungeonDisplay gameData={gameState.game}
                                     palette={gameState.palette}
                                     handleMove={handleMove}
                                     isNextLevelAvailable={isNextLevelAvailable}
                                     getNextLevel={getNextLevel}
                                     isLoading={isLoading}
                                     handleAttack={handleAttack}
                                     handleEquipItem={handleEquipItem}
                                     handlePackItem={handlePackItem}
                                     isLoadingNextLevel={isLoadingNextLevel}
                                     handleHeal={handleHeal}
                    />}
                </> :
                isLoading ?
                    //center this div
                    <div className="flex flex-col justify-center items-center">
                        <img src={`${process.env.PUBLIC_URL}/spinner.gif`} alt="Loading..."
                             className="w-12 h-12 animate-spin"/>
                        <p>Welcome to Abyssal Infinity! Use the arrow keys to move. Find the "X" to move to the next
                            level.</p>
                        <p>I'm constantly updating, may be unstable at times!</p>
                        <p>I apologize for the long initial loading time. Working on cutting this down!</p>
                    </div>
                    :
                    <>
                        <input
                            type="text"
                            placeholder="Enter your player name"
                            value={playerName}
                            onChange={e => setPlayerName(e.target.value)}
                            className="mb-4 px-2 py-1 rounded border-gray-700 text-black"
                        />
                        <button
                            onClick={createNewGame}
                            className="px-8 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
                            disabled={!playerName}  // Disable the button if no player name
                        >
                            Create New Game
                        </button>
                    </>
            }
            <ReactModal isOpen={isGameOver}>
                <h2>Game Over</h2>
                <p>Last Level cleared: {lastLevelCleared}</p>
                {combatLog.map((log, index) => <p key={index}>{log}</p>)}
                <button
                    className="absolute bottom-0 left-0 m-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => setIsGameOver(false)}>Close
                </button>
            </ReactModal>
        </div>
    );
}

export default App;
