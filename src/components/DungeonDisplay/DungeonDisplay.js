import React, {useEffect} from 'react';
import LevelGrid from "./LevelGrid";
import MonsterDisplay from "./MonsterDisplay";
import PlayerDisplay from "./PlayerDisplay";
import InventoryDisplay from "./InventoryDisplay";

const MemoizedLevelGrid = React.memo(LevelGrid);

function DungeonDisplay({
                            gameData, palette, handleMove,
                            isNextLevelAvailable, getNextLevel,
                            isLoading, handleAttack, handleEquipItem, handlePackItem, isLoadingNextLevel
                        }) {
    const levelData = gameData.level;
    // Calculate availableDirections...
    const availableDirections = [];
    const playerView = gameData.player_view;
    const center = Math.floor(playerView.length / 2);
    console.log(`playerView: ${JSON.stringify(playerView)}`);

    if (playerView[center - 1][center] !== '#') availableDirections.push('north');
    if (playerView[center + 1][center] !== '#') availableDirections.push('south');
    if (playerView[center][center - 1] !== '#') availableDirections.push('west');
    if (playerView[center][center + 1] !== '#') availableDirections.push('east');

    let monsterId = null;
    let monsterData = null;
    const exit_description = `There are exits to the: ${availableDirections.join(', ')}.`;
    const isMonsterTile = !isNaN(gameData.player_square_contents) && !(gameData.player_square_contents === "");
    if (isMonsterTile) {
        monsterId = parseInt(gameData.player_square_contents) - 1;
        monsterData = levelData.monsters[monsterId];
        console.log(`Monster data: ${JSON.stringify(monsterData)}`);
    }
    useEffect(() => {
        const handleKeyDown = (event) => {
            event.preventDefault();
            switch (event.key) {
                case 'ArrowUp':
                    if (availableDirections.includes('north')) {
                        handleMove('north');
                    }
                    break;
                case 'ArrowRight':
                    if (availableDirections.includes('east')) {
                        handleMove('east');
                    }
                    break;
                case 'ArrowDown':
                    if (availableDirections.includes('south')) {
                        handleMove('south');
                    }
                    break;
                case 'ArrowLeft':
                    if (availableDirections.includes('west')) {
                        handleMove('west');
                    }
                    break;
                case ' ':
                    if (isNextLevelAvailable) {
                        getNextLevel();
                    }
                    if (isMonsterTile) {
                        handleAttack(monsterId);
                    }
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Make sure to clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMove, availableDirections, getNextLevel, isNextLevelAvailable, handleAttack, isMonsterTile, monsterId]);
    return (
        <div className="p-4 bg-gray-100 rounded shadow-md"
             style={{
                 backgroundColor: palette.background_colors[1],
                 color: palette.text_colors[0],
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 alignItems: 'center'
             }}>
            <div className="flex flex-row items-center justify-between w-full">
                <div style={{width: '33%', padding: '1em'}}>
                    {gameData.player && <PlayerDisplay playerData={gameData.player}/>}
                </div>
                {isLoadingNextLevel ?
                    <div className="flex justify-center items-center" style={{width: '33%', padding: '1em'}}>
                        <div className="loader">
                            <img src={`${process.env.PUBLIC_URL}/spinner.gif`} alt="Loading..."
                                 className="w-10 h-10 animate-spin"/>
                        </div>
                    </div>
                    :
                    <div style={{
                        width: '33%',
                        padding: '1em',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h2 className="text-2xl font-bold mb-2 text-center">{levelData.dungeon.name}</h2>
                        <p className="text-sm mb-4 p-4 rounded shadow-inner" style={{
                            backgroundColor: palette.background_colors[2],
                            color: palette.text_colors[1],
                            fontWeight: 'bold'
                        }}>{levelData.dungeon.backstory}</p>
                        <MemoizedLevelGrid gridData={gameData.player_view} palette={palette}/>
                    </div>
                }
                <div style={{width: '33%', padding: '1em'}}>
                    {monsterData && <MonsterDisplay monsterData={monsterData}/>}
                </div>
            </div>
            <InventoryDisplay inventory={gameData.player.inventory}
                              equipped={gameData.player.equipped}
                              handleEquipItem={handleEquipItem}
                              handlePackItem={handlePackItem}
                              gameId={gameData.id}
            />
        </div>
    );


}

export default DungeonDisplay;
