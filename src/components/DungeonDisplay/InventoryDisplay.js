import React from 'react';

const InventoryDisplay = ({ equipped, inventory, handleEquipItem, handlePackItem, gameId }) => {
    const inventoryItems = Object.entries(inventory).map(([key, item]) => (
        <tr key={key}>
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
                <button onClick={() => handlePackItem(item, gameId)}>Pack</button>
            </td>
        </tr>
    ));

    return (
        <div className="p-10 rounded shadow-lg">
            <h2 className="font-bold text-lg mb-4">Equipped</h2>
            <table className="table-auto w-full mb-10">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Slot</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">HP</th>
                        <th className="px-4 py-2">DMG</th>
                    </tr>
                </thead>
                <tbody>
                    {equippedItems}
                </tbody>
            </table>
            <h2 className="font-bold text-lg mb-4">Inventory</h2>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Slot</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">HP</th>
                        <th className="px-4 py-2">DMG</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryDisplay;
