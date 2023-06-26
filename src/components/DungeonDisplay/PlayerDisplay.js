import React, {useState} from "react";

function PlayerDisplay({playerData, style, handlePackItem, gameId}) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});

    if (!playerData) {
        return null; // If there's no player data, don't render anything
    }

    const openModal = (item) => {
        setShowModal(true);
        setModalContent(item);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const equipped = playerData.equipped
    const equippedItems = {}
    for (let key in equipped) {
        equippedItems[key] = (
            <div key={key} className="ml-4 flex flex-col items-center">
                <img
                    src={equipped[key].image}
                    alt={equipped[key].name}
                    width="50"
                    height="50"
                    onMouseEnter={() => openModal(equipped[key])}
                    onMouseLeave={closeModal}
                    onClick={() => handlePackItem(equipped[key], gameId)}
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
                <p className="text-sm">Level: {playerData.level}</p>
                <p className="text-sm">Damage: {playerData.dmg}</p>
                <p className="text-sm">HP: {playerData.hp}/{playerData.max_hp}</p>
                <p className="text-sm">XP: {playerData.xp}/{playerData.next_xp}</p>
                <p className="text-sm">Gold: {playerData.gold}</p>
            </div>
            <div className="flex flex-col items-center ml-4">
                <div>{equippedItems["head"]}</div>
                <div className="flex justify-between">
                    <div>{equippedItems["gloves"]}</div>
                    <div>{equippedItems["chest"]}</div>
                    <div>{equippedItems["weapon"]}</div>
                </div>
                <div>{equippedItems["leggings"]}</div>
                <div>{equippedItems["boots"]}</div>
            </div>
            {showModal && (
                <div
                    className="fixed bottom-0 right-0 w-50 h-50 flex"
                    onClick={closeModal}>
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <img src={modalContent.image} alt="Full size"/>
                        <p className="mt-4 font-bold">{modalContent.name}</p>
                        <p>HP: {modalContent.hp || 0}</p>
                        <p>Damage: {modalContent.dmg || 0}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerDisplay;
