import axios from "axios";
import {useState} from "react";
import DungeonDisplay from "./components/DungeonDisplay/DungeonDisplay";
import ReactModal from 'react-modal';

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [isNextLevelAvailable, setIsNextLevelAvailable] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [lastLevelCleared, setLastLevelCleared] = useState(0);
    const [gameState, setGameState] = useState({
        game: null,
        palette: {background_colors: [], text_colors: []},
    });


    console.log(`palette: ${JSON.stringify(gameState.palette)}`);
    console.log(`game: ${JSON.stringify(gameState.game)}`);
    console.log(`gameStarted: ${gameStarted}`);

    async function createNewGame() {
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/new-game', {playerName});
            console.log(res.data);
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
        // check if res.data.player_square_contents is a number

        try {
            const res = await axios.post('http://localhost:5000/move', {game_id: gameState.game.id, direction});
            console.log(res.data);
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
        try {
            const res = await axios.get(`http://localhost:5000/next-level?game_id=${gameState.game.id}`);
            console.log(res.data);
            setGameState({
                game: res.data,
                palette: res.data.level.dungeon.color_palette,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAttack(monsterId) {
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/attack', {
                game_id: gameState.game.id,
                monster_id: monsterId
            });
            if (res.data.message === 'Game Over') {
                setIsGameOver(true);
                setLastLevelCleared(res.data.lastLevelCleared)
                setGameStarted(false);
                setPlayerName(''); // Reset player name
                return;
            }
            console.log(res.data);
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
            const res = await axios.post('http://localhost:5000/equip-item', {item, gameId});
            console.log(res.data);
            setGameState((prevState) => ({...prevState, game: res.data}));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePackItem(item, gameId) {
        console.log(`item: ${item}`);
        console.log(`gameId: ${gameId}`);
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/pack-item', {item, gameId});
            console.log(res.data);
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
                <h1 className="text-6xl font-bold">Eternal Depths</h1>
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
                    />}
                </> :
                isLoading ?
                    <img src={`${process.env.PUBLIC_URL}/spinner.gif`} alt="Loading..."
                         className="w-12 h-12 animate-spin"/>
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
                <button onClick={() => setIsGameOver(false)}>Close</button>
            </ReactModal>
        </div>
    );
}

export default App;
