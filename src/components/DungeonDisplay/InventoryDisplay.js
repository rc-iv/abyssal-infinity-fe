import React, {useState} from "react";

const InventoryDisplay = ({inventory, equipped, handleEquipItem, gameId, isAtMerchant, handleSell}) => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    // Create an array of 30 nulls
    let paddedInventory = new Array(30).fill(null);

    // Copy inventory items into the new array
    inventory.slice().reverse().forEach((item, index) => {
        paddedInventory[index] = item;
    });

    const openModal = (item) => {
        setShowModal(true);
        setModalContent(item);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    let rows = [];
    let cells = [];

    paddedInventory.forEach((item, index) => {
        if (item !== null) {
            cells.push(
                <td className="border px-1 py-1 w-14 h-14" key={`${item.name}-${index}`}>
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onMouseEnter={() => openModal(item)}
                        onMouseLeave={closeModal}
                        onClick={() => handleEquipItem(item, gameId)}
                        onContextMenu={(event) => {
                            event.preventDefault(); // Prevents the context menu from showing
                            handleSell(item, gameId);
                        }}
                    />
                </td>
            );
        } else {
            // If item is null, add an empty cell
            cells.push(<td className="border px-1 py-1 w-14 h-14" key={`empty-${index}`}></td>);
        }

        if ((index + 1) % 5 === 0 || index === paddedInventory.length - 1) {
            rows.push(<tr key={`row-${index}`}>{cells}</tr>);
            cells = [];
        }
    });

    return (
        <div className="p-0 rounded shadow-lg flex justify-between" style={{backgroundColor: "tan", color: "black"}}>
            <div className="ml-2">
                <h2 className="font-bold text-lg mb-4">Inventory{isAtMerchant && " (Right Click to Sell)"}</h2>
                <table className="table-auto w-full">
                    <tbody>{rows}</tbody>
                </table>
            </div>
            {showModal && (
                <div className="w-40 h-48 flex" onClick={closeModal}>
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <p className="mt-4 text-sm font-bold">{modalContent.name}</p>
                        <p className="text-sm">
                            HP:{modalContent.hp}(
                            <span
                                style={{
                                    color: modalContent.hp - equipped[modalContent.slot].hp > 0 ? "green" : "red",
                                }}
                            >
                                {modalContent.hp - equipped[modalContent.slot].hp}
                            </span>)
                        </p>
                        <p className="text-sm">
                            DMG:{modalContent.dmg}(
                            <span
                                style={{
                                    color: modalContent.dmg - equipped[modalContent.slot].dmg > 0 ? "green" : "red",
                                }}
                            >
                                {modalContent.dmg - equipped[modalContent.slot].dmg}
                            </span>)
                        </p>
                        {isAtMerchant && <p className="text-sm">Sell: {modalContent.value}</p>}

                        <img src={modalContent.image} alt="Full size" height="50" width="50"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDisplay;
