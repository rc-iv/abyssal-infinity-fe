import React, {useState} from 'react';

const InventoryDisplay = ({equipped, inventory, handleEquipItem, handlePackItem, gameId}) => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const openModal = (imageSrc) => {
        setShowModal(true);
        setModalContent(imageSrc);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    const inventoryItems = [...Object.entries(inventory)].reverse().map(([key, item]) => (
        <tr key={key}>
            <td className="border px-4 py-2">
                <img
                    src={item.image}
                    alt={item.name}
                    width="50"
                    height="50"
                    onMouseEnter={() => openModal(item.image)}
                    onMouseLeave={closeModal}
                />
            </td>
            <td className="border px-4 py-2">{item.slot}</td>
            <td className="border px-4 py-2">{item.name}</td>
            <td className="border px-4 py-2">{item.hp}</td>
            <td className="border px-4 py-2">{item.dmg}</td>
            <td className="border px-4 py-2">
                <button onClick={() => handleEquipItem(item, gameId)}>Equip</button>
            </td>
        </tr>
    ));

    const equippedItems = Object.entries(equipped).map(([key, item]) => (
        <tr key={key}>
            <td className="border px-4 py-2">{item.slot}</td>
            <td className="border px-4 py-2">{item.name}</td>
            <td className="border px-4 py-2">{item.hp}</td>
            <td className="border px-4 py-2">{item.dmg}</td>
            <td className="border px-4 py-2">
                {item.name && <button onClick={() => handlePackItem(item, gameId)}>Pack</button>}
            </td>
        </tr>
    ));

    return (
        <div className="p-10 rounded shadow-lg flex justify-between">
            <div className="w-1/2 mr-2">
                <h2 className="font-bold text-lg mb-4">Equipped</h2>
                <table className="table-auto w-full mb-10">
                    <thead>
                    {/* existing code... */}
                    </thead>
                    <tbody>
                    {equippedItems}
                    </tbody>
                </table>
            </div>
            <div className="w-1/2 ml-2">
                <h2 className="font-bold text-lg mb-4">Inventory</h2>
                <table className="table-auto w-full">
                    <thead>
                    {/* existing code... */}
                    </thead>
                    <tbody>
                    {inventoryItems}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal}>
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <img src={modalContent} alt="Full size"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDisplay;
