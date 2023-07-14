import React, {useEffect} from 'react';
import LevelGrid from "./LevelGrid";
import MonsterDisplay from "./MonsterDisplay";
import PlayerDisplay from "./PlayerDisplay";
import InventoryDisplay from "./InventoryDisplay";
import HealerDisplay from "./HealerDisplay";
import MerchantDisplay from "./MerchantDisplay";

const MemoizedLevelGrid = React.memo(LevelGrid);

function DungeonDisplay({
                            playerData, palette, handleMove,
                            isNextLevelAvailable, getNextLevel,
                            handleAttack, handleEquipItem,
                            handlePackItem, isLoadingNextLevel,
                            handleHeal, handleSell, handleBuy,
                            isMoving
                        }) {
    const gameData = playerData.current_game;
    const levelData = gameData.level;

    const playerView = playerData.player_view;
    const center = Math.floor(playerView.length / 2);

    let combat_log;
    if (gameData.combat_just_ended) {
        // initialize combat log and show if combat just ended
        combat_log = gameData.combat_log;
        let key = Object.keys(combat_log).length -1;
        combat_log = gameData.combat_log[key].combat_messages;
    }

    // check if player is on a monster tile
    let monsterId = null;
    let monsterData = null;
    const isMonsterTile = !isNaN(playerData.player_square_contents) && !(playerData.player_square_contents === "");
    if (isMonsterTile) {
        monsterId = parseInt(playerData.player_square_contents) - 1;
        monsterData = levelData.monsters[monsterId];

    }
    const isHealerTile = playerData.player_square_contents === 'H';
    const isMerchantTile = playerData.player_square_contents === 'M';

    useEffect(() => {
        let availableDirections = [];
        if (playerView[center - 1][center] !== '#') availableDirections.push('north');
        if (playerView[center + 1][center] !== '#') availableDirections.push('south');
        if (playerView[center][center - 1] !== '#') availableDirections.push('west');
        if (playerView[center][center + 1] !== '#') availableDirections.push('east');
        if (isMonsterTile) {
            // remove all exits, player must engage or retreat
            availableDirections.splice(0, availableDirections.length);
        }
        const handleKeyDown = (event) => {
            if (!isMoving && !isLoadingNextLevel) {
                switch (event.key) {
                    case 'ArrowUp':
                        event.preventDefault();
                        if (availableDirections.includes('north')) {
                            handleMove('north');
                        }
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        if (availableDirections.includes('east')) {
                            handleMove('east');
                        }
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        if (availableDirections.includes('south')) {
                            handleMove('south');
                        }
                        break;
                    case 'ArrowLeft':
                        event.preventDefault();
                        if (availableDirections.includes('west')) {
                            handleMove('west');
                        }
                        break;
                    case ' ':
                        event.preventDefault();
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
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Make sure to clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMove, getNextLevel, isNextLevelAvailable, handleAttack, isMonsterTile, monsterId, isLoadingNextLevel, isMoving, center, playerView]);
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
                    <PlayerDisplay playerData={playerData}
                                   handlePackItem={handlePackItem}
                                   isAtMerchant={isMerchantTile}
                                   handleSell={handleSell}
                    />
                    <InventoryDisplay player={playerData}
                                      handleEquipItem={handleEquipItem}
                                      isAtMerchant={isMerchantTile}
                                      handleSell={handleSell}
                    />
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
                        <MemoizedLevelGrid gridData={playerData.player_view} palette={palette}
                                           monsters={levelData.monsters}/>
                        <p>Monsters Remaining: {gameData.monsters_remaining}</p>
                    </div>
                }
                <div style={{width: '33%', padding: '1em'}}>
                    {isHealerTile &&
                        <HealerDisplay
                            handleHeal={handleHeal}
                            player={playerData}
                        />}
                    {isMerchantTile &&
                        <MerchantDisplay
                            handleBuy={handleBuy}
                            gameData={gameData}
                        />}
                    {monsterData &&
                        <MonsterDisplay
                            monsterData={monsterData}
                            handleMove={handleMove}
                            handleAttack={handleAttack}
                            monster_id={monsterId}
                        />}
                    {gameData.combat_just_ended &&
                        <div style={{height: '300px', overflowY: 'auto'}}>
                            {combat_log.map((log, index) => <p key={index}>{log}</p>)}
                        </div>}
                    {/*If isNextLevelAvailable is true, render "Press Space to go to next level*/}
                    {isNextLevelAvailable && !isLoadingNextLevel && <p>Press Space to go to next level</p>}

                </div>
            </div>
        </div>
    );


}

export default DungeonDisplay;
