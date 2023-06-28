import React from 'react';

const NGROK_PATH = 'https://d76fab24d4c1.ngrok.app';
const LevelGrid = ({gridData, palette, monsters}) => {
    const gridClass = `grid grid-cols-5 mb-4 w-64 text-xl`;
    const getImageSrc = (cell) => {
        switch (cell) {
            case "#":
                return `${NGROK_PATH}/api/images/board/wall.png`;
            case "":
                return `${NGROK_PATH}/api/images/board/floor.png`;
            case "O":
                return `${NGROK_PATH}/api/images/board/player.png`; // replace with your player image URL
            case "E":
                return `${NGROK_PATH}/api/images/board/entry_portal.png`;
            case "X":
                return `${NGROK_PATH}/api/images/board/exit_portal.png`;
            case "H":
                return `${NGROK_PATH}/api/images/board/healer.png`;
            case "M":
                return `${NGROK_PATH}/api/images/board/merchant.png`;
            default:
                if (!isNaN(cell)) {
                    const cell_int = parseInt(cell) - 1;
                    const imageURL = monsters[cell_int].imageURL;
                    if (imageURL === null) {
                        return "https://d76fab24d4c1.ngrok.app/api/images/monsters/skull.png";
                    }
                    return monsters[cell_int].imageURL;
                }
                return null;
        }
    };
    return (
        <div className={gridClass}
             style={{backgroundColor: palette.background_colors[2], color: palette.text_colors[1]}}>
            {gridData.map((row, i) =>
                row.map((cell, j) => (
                    <div
                        key={`${i}-${j}`}
                        className="w-auto flex items-center justify-center border border-gray-400"
                        style={{fontWeight: 'bold', width: '100%', height: '100%'}}
                    >
                        <img src={getImageSrc(cell)} alt={cell} style={{width: '100%', height: '100%'}}/>
                    </div>
                ))
            )}
        </div>
    );
}

export default LevelGrid;
