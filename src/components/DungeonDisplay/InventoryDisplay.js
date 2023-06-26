import React, { useState } from "react";

const InventoryDisplay = ({ inventory, equipped, handleEquipItem, gameId }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModal = (imageSrc) => {
    setShowModal(true);
    setModalContent(imageSrc);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const inventoryItems = [...Object.entries(inventory)]
    .reverse()
    .map(([key, item]) => (
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
        <td className="border px-4 py-2">{item.name}</td>
        <td className="border px-4 py-2">
          {item.hp} (
          <span
            style={{
              color: item.hp - equipped[item.slot].hp > 0 ? "green" : "red",
            }}
          >
            {item.hp - equipped[item.slot].hp}
          </span>
          )
        </td>
        <td className="border px-4 py-2">
          {item.dmg} (
          <span
            style={{
              color: item.dmg - equipped[item.slot].dmg > 0 ? "green" : "red",
            }}
          >
            {item.dmg - equipped[item.slot].dmg}
          </span>
          )
        </td>
        <td className="border px-4 py-2">
          <button onClick={() => handleEquipItem(item, gameId)}>Equip</button>
        </td>
      </tr>
    ));

  return (
    <div className="p-0 rounded shadow-lg flex justify-between" style={{ backgroundColor: "tan", color: "black" }}>
      <div className="w-1/2 ml-2">
        <h2 className="font-bold text-lg mb-4">Inventory</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">HP</th>
              <th className="px-4 py-2">DMG</th>
            </tr>
          </thead>
          <tbody>{inventoryItems}</tbody>
        </table>
      </div>
      {showModal && (
        <div
          className="fixed bottom-0 right-0 w-50 h-50 flex"
          onClick={closeModal}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <img src={modalContent} alt="Full size" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDisplay;
