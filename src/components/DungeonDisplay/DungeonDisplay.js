import React from 'react';
import LevelGrid from "./LevelGrid";
import DirectionControls from "./DirectionControls";
import MonsterDisplay from "./MonsterDisplay";
import PlayerDisplay from "./PlayerDisplay";
import InventoryDisplay from "./InventoryDisplay";

const MemoizedLevelGrid = React.memo(LevelGrid);
const MemoizedDirectionControls = React.memo(DirectionControls);

function DungeonDisplay({
                            gameData, palette, handleMove,
                            isNextLevelAvailable, getNextLevel,
                            isLoading, handleAttack, handleEquipItem, handlePackItem
                        }) {
    if (!gameData) {
        return <p className="text-lg text-red-500">No data yet</p>;
    }
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
            <h2 className="text-2xl font-bold mb-2 text-center">{levelData.dungeon.name}</h2>
            <p className="text-sm mb-4 p-4 rounded shadow-inner" style={{
                width: '50%',
                backgroundColor: palette.background_colors[2],
                color: palette.text_colors[1],
                fontWeight: 'bold'
            }}>{levelData.dungeon.backstory}</p>
            <div className="flex flex-row items-center justify-between w-full">
                <div style={{width: '33%', padding: '1em'}}>
                    {gameData.player && <PlayerDisplay playerData={gameData.player}/>}
                </div>
                <div style={{
                    width: '33%',
                    padding: '1em',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <p className="text-sm mb-4 p-4 rounded shadow-inner" style={{
                        backgroundColor: palette.background_colors[2],
                        color: palette.text_colors[1],
                        fontWeight: 'bold'
                    }}>{gameData.player_square_description}{exit_description}</p>
                    <MemoizedLevelGrid gridData={gameData.player_view} palette={palette}/>
                </div>
                <div style={{width: '33%', padding: '1em'}}>
                    {monsterData && <MonsterDisplay monsterData={monsterData}/>}
                </div>
            </div>
            <MemoizedDirectionControls handleMove={handleMove} handleAttack={handleAttack}
                                       isMonsterTile={isMonsterTile} availableDirections={availableDirections}
                                       isNextLevelAvailable={isNextLevelAvailable} getNextLevel={getNextLevel}
                                       isLoading={isLoading} monsterId={monsterId}/>
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
