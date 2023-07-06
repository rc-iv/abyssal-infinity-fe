import React, {useState} from "react";

function PlayerDisplay({playerData, style, handlePackItem, isAtMerchant, handleSell}) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});


    const openModal = (item) => {
        setShowModal(true);
        setModalContent(item);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    let click_handler = null;

    const equipped = playerData.equipped
    const equippedItems = {}
    for (let key in equipped) {

        if (isAtMerchant) {
            click_handler = () => handleSell(equipped[key], playerData.id)
        } else {
            click_handler = () => handlePackItem(equipped[key], playerData.id)
        }
        equippedItems[key] = (
            <div key={key} className="ml-4 flex flex-col items-center">
                <img
                    src={equipped[key].image}
                    alt={equipped[key].name}
                    width="50"
                    height="50"
                    onMouseEnter={() => openModal(equipped[key])}
                    onMouseLeave={closeModal}
                    onClick={click_handler}
                />
            </div>
        )
    }

    return (
        <div className="p-4 rounded shadow-md flex flex-wrap"
             style={{
                 backgroundColor: "tan",
                 color: "black",
                 fontFamily: "Cinzel, serif",
                 ...style
             }}
        >
            <div className="flex-1 mb-4">
                <h3 className="text-xl font-bold mb-2">{playerData.name}</h3>
                <p className="text-lg">Level: {playerData.level}</p>
                <p className="text-lg">Damage: {playerData.dmg}</p>
                <p className="text-lg">HP: {playerData.hp}/{playerData.max_hp}</p>
                <p className="text-lg">XP: {playerData.xp}/{playerData.next_xp}</p>
                <p className="text-lg">Gold: {playerData.gold}</p>
            </div>

            {showModal && (
                <div
                    className="w-20 h-20 flex"
                    onClick={closeModal}>
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <img src={modalContent.image} alt="Full size"/>
                        <p className="mt-4 text-sm font-bold">{modalContent.name}</p>
                        <p className="text-xs">HP: {modalContent.hp || 0}</p>
                        <p className="text-xs">Damage: {modalContent.dmg || 0}</p>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center ml-4">
                <div>{equippedItems["helmet"]}</div>
                <div className="flex justify-between">
                    <div>{equippedItems["weapon"]}</div>
                    <div>{equippedItems["chest"]}</div>
                    <div>{equippedItems["gloves"]}</div>
                </div>
                <div>{equippedItems["leg"]}</div>
                <div>{equippedItems["boots"]}</div>
            </div>
        </div>
    );
}

export default PlayerDisplay;
