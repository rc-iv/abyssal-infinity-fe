import React from 'react';

function PlayerDisplay({playerData, style}) {
    if (!playerData) {
        return null; // If there's no player data, don't render anything
    }
    console.log(`playerData: ${JSON.stringify(playerData)}`);
    return (
        <div className="p-4 bg-blue-400 rounded shadow-md" style={style}>
            <h3 className="text-xl font-bold mb-2">{playerData.name}</h3>
            <p className="text-sm mb-4">Level: {playerData.level}</p>
            <p className="text-sm mb-4">Damage: {playerData.dmg}</p>
            <p className="text-sm mb-4">HP: {playerData.hp}/{playerData.max_hp}</p>
            {/* display 0 if playerData.nexXp is n*/}
            <p className="text-sm mb-4">XP: {playerData.xp}/{playerData.next_xp}</p>
            <p className="text-sm mb-4">Gold: {playerData.gold}</p>
        </div>
    );
}

export default PlayerDisplay;
