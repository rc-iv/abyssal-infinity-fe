import React from "react";

function MerchantDisplay({gameData, handleBuy}) {
    const merchant = gameData.level.merchant;

    return (
        <div className="p-4 bg-yellow-800 rounded shadow-md relative">
            <h3 className="text-xl font-bold mb-2">{merchant.name}</h3>
            <p className="text-sm mb-4">{merchant.description}</p>
            <div>
                {merchant.inventory.map((item, index) => (
                    <div key={index} className="p-2 mb-2 bg-black rounded shadow-md">
                        <img src={item.image} alt={item.name} height="50" width="50" />
                        <p className="text-lg font-bold">{item.name}</p>
                        <p>HP: {item.hp}</p>
                        <p>DMG: {item.dmg}</p>
                        <p>Value: {item.value}</p>
                        <button
                            onClick={() => handleBuy(item, gameData.id)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Buy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MerchantDisplay;
