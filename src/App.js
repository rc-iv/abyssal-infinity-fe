import {useState, useEffect} from "react";
import DungeonDisplay from "./components/DungeonDisplay/DungeonDisplay";
import ReactModal from 'react-modal';
import {v4 as uuidv4} from 'uuid';


const socketUrl = "wss://gevfj6kknf.execute-api.us-east-1.amazonaws.com/production";


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
    const [socketStatus, setSocketStatus] = useState("Connecting...");
    const [socket, setSocket] = useState(null);

    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
    }

    useEffect(() => {
        try {
            const ws = new WebSocket(socketUrl);

            ws.onopen = () => {
                setSocketStatus("Connected");
                setSocket(ws);
            };

            ws.onclose = () => {
                setSocketStatus("Disconnected");
                setSocket(null);
            };

            ws.onerror = (error) => {
                console.log("WebSocket error:", error);
                setSocketStatus("Connection failed");
                setSocket(null);
            };

            ws.onmessage = (message) => {
                console.log("Received message:", message);
                let action = JSON.parse(message.data).message.action;
                console.log(`Action: ${JSON.stringify(action)}`);
                let data = JSON.parse(message.data).message.data;
                console.log(`Data: ${JSON.stringify(data)}`);
                let status = 200;
                if (data !== null) {
                    status = data.status;
                    console.log(`Status: ${JSON.stringify(status)}`);
                }
                if (status === '400') {
                    alert(data.message);
                    setIsLoading(false);
                    setIsLoadingNextLevel(false);
                    setIsMoving(false);
                } else {
                    switch (action) {
                        case 'newGame':
                            // handle new game response
                            setPlayerState({
                                player: data,
                                palette: data.current_game.level.dungeon.color_palette,
                            });
                            setGameStarted(true);
                            setIsLoading(false);
                            break;
                        case 'move':
                            // handle move response
                            if (data.player_square_contents === 'X') {
                                setIsNextLevelAvailable(true);
                            }

                            setPlayerState((prevState) => ({...prevState, player: data}));
                            setIsMoving(false);
                            setIsLoading(false);
                            break;
                        case 'nextLevel':
                            // handle next level response
                            setIsLoading(false);
                            setIsLoadingNextLevel(false);
                            setIsNextLevelAvailable(false);
                            setPlayerState((prevState) => ({...prevState, player: data}));
                            break;
                        case 'attack':
                            // handle attack response
                            setIsLoading(false);
                            if (data.message === 'Game Over') {
                                setIsGameOver(true);
                                setLastLevelCleared(data.last_level_cleared)
                                setCombatLog(data.combat_log);
                                setGameStarted(false);
                                setPlayerName('');
                            }
                            setPlayerState((prevState) => ({...prevState, player: data}));
                            break;
                        case 'equipItem':
                            // handle equip item response
                            setIsLoading(false);
                            setPlayerState((prevState) => ({...prevState, player: data}));
                        case 'packItem':
                            // handle pack item response
                            setIsLoading(false);
                            setPlayerState((prevState) => ({...prevState, player: data}));
                        case 'heal':
                            // handle heal response
                            setIsLoading(false);
                            if (data.status == '600') {
                                alert(data.message);
                            } else {
                                setPlayerState((prevState) => ({...prevState, player: data}));
                            }
                            break;
                        case 'sell':
                            // handle sell response
                            setIsLoading(false);
                            if (data.status == '600') {
                                alert(data.message);
                            } else {
                                setPlayerState((prevState) => ({...prevState, player: data}));
                            }
                            break;
                        case 'buy':
                            // handle buy response
                            setIsLoading(false);
                            if (data.status == '600') {
                                alert(data.message);
                            } else {
                                setPlayerState((prevState) => ({...prevState, player: data}));
                            }
                            break;
                        case 'warmup':
                            break;
                        default:
                            console.log(`Unknown action: ${action}`);
                            break;
                    }
                }
            };
        } catch (error) {
            console.log("Failed to connect to WebSocket:", error);
            setSocketStatus("Connection failed");
        }
    }, [socketStatus]);

    function sendMessage(action, data) {
        if (socket) {
            console.log(socket);
            const message = JSON.stringify({
                action: action,
                data: data
            });
            socket.send(message);
        }
    };

    function createNewGame() {
        setIsLoading(true);
        userId = localStorage.getItem('userId');
        if (!userId) {
            userId = uuidv4();
            localStorage.setItem('userId', userId);
        }
        console.log(`Creating new game with id ${userId}`)
        warmUpLambdas();
        sendMessage("newGame", {playerName: playerName, userId: userId, warmup: false})
    }

    function handleMove(direction) {
        setIsLoading(true);
        setIsMoving(true);
        sendMessage("move", {direction: direction, player: playerState.player, warmup: false})
    }

    function getNextLevel() {
        setIsLoading(true);
        setIsLoadingNextLevel(true);
        sendMessage("nextLevel", {userId: userId, player: playerState.player, warmup: false})
    }

    function handleAttack(monsterId) {
        setIsLoading(true);
        sendMessage("attack", {monsterId: monsterId, player: playerState.player, warmup: false})
    }

    async function handleEquipItem(item, playerId) {
        setIsLoading(true);
        sendMessage("equipItem", {item: item, player: playerState.player, warmup: false});
    }

    async function handlePackItem(item, playerId) {
        setIsLoading(true);
        sendMessage("packItem", {item: item, player: playerState.player, warmup: false});
    }

    async function handleHeal(playerId) {
        setIsLoading(true);
        sendMessage("heal", {player: playerState.player, warmup: false});
    }

    async function handleSell(item, playerId) {
        setIsLoading(true);
        sendMessage("sell", {item: item, player: playerState.player, warmup: false});
    }

    async function handleBuy(item) {
        setIsLoading(true);
        sendMessage("buy", {item: item, player: playerState.player, warmup: false});
    }

    async function warmUpLambdas() {
        const function_lambdas = ["move", "nextLevel", "attack", "equipItem", "packItem", "heal", "sell", "buy"]
        for (const functionName of function_lambdas) {
            try {
                await sendMessage(functionName, {warmup: true});
                console.log(`Lambda ${functionName} warmed up`);
            } catch (error) {
                console.error(`Failed to warm up ${functionName}:`, error);
            }
        }
    }

    return (
        <div
            className="App bg-gradient-to-r from-black to-gray-900 min-h-screen flex flex-col justify-center items-center">
            <header className="App-header mb-8">
                <h1 className="text-6xl font-bold text-white">Abyssal Infinity</h1>
            </header>

            {/* Check if the user has registered and the game has started */}
            {gameStarted ? (
                <>
                    <DungeonDisplay
                        playerData={playerState.player}
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
                    />
                </>
            ) : isLoading ? (
                <div className="flex flex-col justify-center items-center">
                    <img src={`${process.env.PUBLIC_URL}/spinner.gif`} alt="Loading..."
                         className="w-12 h-12 animate-spin"/>
                </div>
            ) : (
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
                        disabled={!playerName}
                    >
                        Create New Game
                    </button>
                </>
            )}

            <ReactModal isOpen={isGameOver}>
                <h2>Game Over</h2>
                <p>Last Level cleared: {lastLevelCleared}</p>
                {combatLog.map((log, index) => <p key={index}>{log}</p>)}
                <button
                    className="absolute bottom-0 left-0 m-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => setIsGameOver(false)}
                >
                    Close
                </button>
            </ReactModal>
        </div>
    );
}

export default App;