import axios from "axios";
import {useState} from "react";
import DungeonDisplay from "./components/DungeonDisplay/DungeonDisplay";
import ReactModal from 'react-modal';
import {v4 as uuidv4} from 'uuid';


const server = "https://d76fab24d4c1.ngrok.app"

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
    const [isMoving, setIsMoving] = useState(false);
    const [playerState, setPlayerState] = useState({
        player: null,
        palette: {background_colors: [], text_colors: []},
    });

    const userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', userId);


    async function createNewGame() {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/new-game`, {userId: userId, playerName: playerName});
            setPlayerState({
                player: res.data,
                palette: res.data.current_game.level.dungeon.color_palette,
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
        setIsMoving(true);
        try {
            const res = await axios.post(`${server}/move`, {
                userId: userId,
                direction: direction,
                player: playerState.player
            });
            if (res.data.player_square_contents === 'X') {
                setPlayerState((prevState) => ({...prevState, player: res.data}));
                setIsNextLevelAvailable(true);
            } else {
                setPlayerState((prevState) => ({...prevState, player: res.data}));
                setIsNextLevelAvailable(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsMoving(false);
        }
    }

    async function getNextLevel() {
        setIsLoading(true);
        setIsLoadingNextLevel(true);
        try {
            const res = await axios.post(`${server}/next-level`, {userId: userId, playerId: playerState.player.id});
            setPlayerState({
                player: res.data,
                palette: res.data.current_game.level.dungeon.color_palette,
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
                userId: userId,
                playerId: playerState.player.id,
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
            setPlayerState((prevState) => ({...prevState, player: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleEquipItem(item, playerId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/equip-item`, {item: item, playerId: playerId, userId: userId});
            setPlayerState((prevState) => ({...prevState, player: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePackItem(item, playerId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/pack-item`, {item: item, playerId: playerId, userId: userId});
            setPlayerState((prevState) => ({...prevState, player: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleHeal(playerId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/heal`, {playerId: playerId, userId: userId});
            setPlayerState((prevState) => ({...prevState, player: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSell(item, playerId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/sell`, {playerId: playerId, item: item, userId: userId});
            setPlayerState((prevState) => ({...prevState, player: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleBuy(item, gameId) {
        setIsLoading(true);
        try {
            const res = await axios.post(`${server}/buy`, {gameId: gameId, item: item});
            setPlayerState((prevState) => ({...prevState, game: res.data}));
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
                    {<DungeonDisplay playerData={playerState.player}
                                     palette={playerState.palette}
                                     handleMove={handleMove}
                                     isNextLevelAvailable={isNextLevelAvailable}
                                     getNextLevel={getNextLevel}
                                     isLoading={isLoading}
                                     handleAttack={handleAttack}
                                     handleEquipItem={handleEquipItem}
                                     handlePackItem={handlePackItem}
                                     isLoadingNextLevel={isLoadingNextLevel}
                                     handleHeal={handleHeal}
                                     handleBuy={handleBuy}
                                     handleSell={handleSell}
                                     isMoving={isMoving}
                    />}
                </> :
                isLoading ?
                    //center this div
                    <div className="flex flex-col justify-center items-center">
                        <img src={`${process.env.PUBLIC_URL}/spinner.gif`} alt="Loading..."
                             className="w-12 h-12 animate-spin"/>
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
