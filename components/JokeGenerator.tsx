// JokeGenerator.tsx
import React, { useEffect, useState } from 'react';

const JokeGenerator: React.FC = () => {
    const [joke, setJoke] = useState<string>('');
    const [category, setCategory] = useState<string>('Programming');
    const [favorites, setFavorites] = useState<string[]>([]);

    const fetchJoke = async () => {
        const response = await fetch(`https://v2.jokeapi.dev/joke/${category}`);
        const data = await response.json();
        if (data.type === 'single') {
            setJoke(data.joke);
        } else {
            setJoke(`${data.setup} - ${data.delivery}`);
        }
    };

    const saveFavorite = () => {
        if (joke && !favorites.includes(joke)) {
            setFavorites([...favorites, joke]);
        }
    };

    useEffect(() => {
        fetchJoke();
    }, [category]);

    return (
        <div>
            <h1>Joke Generator</h1>
            <select onChange={(e) => setCategory(e.target.value)}>
                <option value="Programming">Programming</option>
                <option value="Miscellaneous">Miscellaneous</option>
                <option value="Puny">Puny</option>
            </select>
            <p>{joke}</p>
            <button onClick={fetchJoke}>Get New Joke</button>
            <button onClick={saveFavorite}>Save Favorite</button>
            <h2>Favorite Jokes</h2>
            <ul>
                {favorites.map((favJoke, index) => (
                    <li key={index}>{favJoke}</li>
                ))}
            </ul>
        </div>
    );
};

export default JokeGenerator;