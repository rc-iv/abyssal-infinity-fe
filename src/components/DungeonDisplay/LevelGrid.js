import React from 'react';

const AWS_S3_PATH = 'https://abyssal-infinity-images.s3.amazonaws.com';
const LevelGrid = ({gridData, palette, monsters}) => {
    const gridClass = `grid grid-cols-5 mb-4 w-64 text-xl`;
    const getImageSrc = (cell) => {
        switch (cell) {
            case "#":
                return `${AWS_S3_PATH}/images/board/wall.png`;
            case "":
                return `${AWS_S3_PATH}/images/board/floor.png`;
            case "O":
                return `${AWS_S3_PATH}/images/board/player.png`; // replace with your player image URL
            case "E":
                return `${AWS_S3_PATH}/images/board/entry_portal.png`;
            case "X":
                return `${AWS_S3_PATH}/images/board/exit_portal.png`;
            case "H":
                return `${AWS_S3_PATH}/images/board/healer.png`;
            case "M":
                return `${AWS_S3_PATH}/images/board/merchant.png`;
            default:
                if (!isNaN(cell)) {
                    const cell_int = parseInt(cell) - 1;
                    const imageURL = monsters[cell_int].imageURL;
                    if (imageURL === null) {
                        return `${AWS_S3_PATH}/images/monsters/skull.png`;
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
