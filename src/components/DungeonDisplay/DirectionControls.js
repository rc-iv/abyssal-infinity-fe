import React, {useEffect} from "react";

function DirectionControls({
                               handleMove,
                               availableDirections,
                               isNextLevelAvailable,
                               getNextLevel,
                               isLoading,
                               handleAttack,
                               isMonsterTile,
                               monsterId
                           }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
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
        };
        window.addEventListener('keydown', handleKeyDown);

        // Make sure to clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMove, availableDirections, getNextLevel, isNextLevelAvailable, handleAttack, isMonsterTile, monsterId]);
    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <button
                onClick={() => handleMove('north')}
                className={`mb-2 text-5xl ${availableDirections.includes('north') ? 'text-black' : 'text-gray-500 opacity-50'}`}
                disabled={!availableDirections.includes('north')}
            >
                &#x2191;
            </button>
            <div className="flex">
                <button
                    onClick={() => handleMove('west')}
                    className={`mr-2 text-5xl ${availableDirections.includes('west') ? 'text-black' : 'text-gray-500 opacity-50'}`}
                    disabled={!availableDirections.includes('west')}
                >
                    &#x2190;
                </button>

                {isMonsterTile &&
                    (isLoading ?
                            <img src={`${process.env.PUBLIC_URL}/spinner.gif`} alt="Loading..."
                                 className="w-10 h-10 animate-spin"/>
                            :
                            <button
                                onClick={() => handleAttack(monsterId)}
                                className="px-2 py-1 bg-red-500 text-white rounded">
                                Attack
                            </button>
                    )
                }

                {/* The "Next Level" button */}
                {isNextLevelAvailable &&
                    (isLoading ?
                            <img src={`${process.env.PUBLIC_URL}/spinner.gif`} alt="Loading..."
                                 className="w-10 h-10 animate-spin"/>
                            :
                            <button onClick={getNextLevel} className="px-2 py-1 bg-blue-500 text-white rounded">
                                Next Level
                            </button>
                    )
                }

                <button
                    onClick={() => handleMove('east')}
                    className={`ml-2 text-5xl ${availableDirections.includes('east') ? 'text-black' : 'text-gray-500 opacity-50'}`}
                    disabled={!availableDirections.includes('east')}
                >
                    &#x2192;
                </button>
            </div>
            <button
                onClick={() => handleMove('south')}
                className={`mt-2 text-5xl ${availableDirections.includes('south') ? 'text-black' : 'text-gray-500 opacity-50'}`}
                disabled={!availableDirections.includes('south')}
            >
                &#x2193;
            </button>
        </div>
    );
}

export default DirectionControls;
