import React, {useEffect} from 'react';

function HealerDisplay({gameData, handleHeal}) {
    const heal_cost = gameData.player.heals_used * 100;
    const can_afford_healing = gameData.player.gold >= heal_cost;
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'h':
                    event.preventDefault();
                    handleHeal();
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
    }, [handleHeal]);
    return (
        <div className="p-4 bg-red-800 rounded shadow-md relative">
            <h3 className="text-xl font-bold mb-2">Mystical Healer</h3>
            <p className="text-sm mb-4">This mystical healer will provide healing for your coin</p>
            <p className="text-sm mb-4">The cost to heal is {heal_cost}</p>
            {can_afford_healing &&
            <div>
                <p>.</p>
                <button
                    className="absolute bottom-0 left-0 m-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => handleHeal(gameData.id)}>Heal
                </button>
            </div>
            }
        </div>
    );
}

export default HealerDisplay;