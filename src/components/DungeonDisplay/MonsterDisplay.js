import React, {useEffect} from 'react';

function MonsterDisplay({monsterData, style, handleMove, handleAttack, monster_id}) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'r':
                    event.preventDefault();
                    handleMove('retreat');
                    break;
                case 'a':
                    event.preventDefault();
                    handleAttack(monster_id);
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
    }, [handleMove, handleAttack]);
    return (
        <div className="p-4 bg-red-800 rounded shadow-md relative" style={style}>
            <h3 className="text-xl font-bold mb-2">{monsterData.name}</h3>
            <p className="text-sm mb-4">{monsterData.description}</p>
            <p className="text-sm mb-4">HP: {monsterData.hp}</p>
            {/*<p className="text-sm mb-4">{monsterData.loot.equipment && `Loot: ${monsterData.loot.equipment.name}`}</p>*/}
            {/*<p className="text-sm mb-4">Gold: {monsterData.loot.gold}</p>*/}
            <p> .</p>
            <button className="absolute bottom-0 left-0 m-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => handleMove('retreat')}>(R)etreat
            </button>
            <button
                className="absolute bottom-0 right-0 m-2 py-1 px-3 bg-green-500 text-white rounded hover:bg-green-700"
                onClick={() => handleAttack(monster_id)}>(A)ttack
            </button>
        </div>
    );
}

export default MonsterDisplay;
