import React from 'react';

const LevelGrid = ({ gridData, palette }) => {
  // find the length of grid data
    const gridClass = `grid grid-cols-3 mb-4 w-64 text-xl`;
    console.log(`gridClass: ${gridClass}`)
  return (
    <div className={gridClass} style={{backgroundColor: palette.background_colors[2], color: palette.text_colors[1]}}>
      {gridData.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className="w-auto flex items-center justify-center border border-gray-400"
            style={{fontWeight: 'bold', width: '100%', height: '100%'}}   // Add width and height
          >
            {cell || '\u00A0'}   {/* Add non-breaking space if cell is empty */}
          </div>
        ))
      )}
    </div>
  );
}

export default LevelGrid;
