import React from 'react';

function MonsterDisplay({monsterData, style}) {
    if (!monsterData) {
        return null; // If there's no monster data, don't render anything
    }

    return (
        <div className="p-4 bg-red-400 rounded shadow-md "
             style={style}>
            <h3 className="text-xl font-bold mb-2">{monsterData.name}</h3>
            <p className="text-sm mb-4">{monsterData.description}</p>
            <p className="text-sm mb-4">HP: {monsterData.hp}</p>
            <p className="text-sm mb-4">{monsterData.loot.equipment && `Loot: ${monsterData.loot.equipment.name}`}</p>
            <p className="text-sm mb-4">Gold: {monsterData.loot.gold}</p>
        </div>
    );
}

export default MonsterDisplay;
