// DungeonForm.js
import React, {useState} from 'react';

function DungeonForm({onSubmit}) {
    const [level, setLevel] = useState(1);
    const [theme, setTheme] = useState("Theme");
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({level}, {theme});
    }

    return (
        <form className="bg-black text-white"onSubmit={handleSubmit}>
            <p>Procedural Dungeon Generator</p>
            <label>
                Level:
                <input
                    className="text-black"
                    type="number"
                    min="1"
                    max="100"
                    value={level}
                    onChange={(event) => setLevel(Number(event.target.value))}
                />
                Theme:
                <input
                    className="text-black"
                    type="string"
                    onChange={(event) => setTheme(event.target.value)}
                />

            </label>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Generate Level
            </button>
        </form>
    );
}

export default DungeonForm;
