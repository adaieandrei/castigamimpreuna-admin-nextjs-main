import { useState, useEffect } from 'react';
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'

export default function GridToolbar(props) {
    //count how many lost and won and active games
    const [gamesWon, setGamesWon] = useState(0);
    const [gamesLost, setGamesLost] = useState(0);
    const [gamesActive, setGamesActive] = useState(0);
    const [percentWon, setPercentWon] = useState(0);

    useEffect(() => {
        if (props) {
            let won = 0;
            let lost = 0;
            let active = 0;
            let percent = 0;
            props.meciuri.forEach((game) => {
                if (game.status === 'win') {
                    won++;
                } else if (game.status === 'lost') {
                    lost++;
                } else {
                    active++;
                }
            })
            percent = Math.round((won / (won + lost)) * 100);
            setPercentWon(percent);
            setGamesWon(won);
            setGamesLost(lost);
            setGamesActive(active);
            setDoc(doc(firestoreDB, 'stats', 'games'), {
                won: won,
                lost: lost,
                active: active,
                percent: percent,
                total: won + lost + active,
            }, { merge: true })
        }
    }, [props])
    return (
        <div className='flex flex-row justify-end border-b p-2'>
            <span className='text-sm text-gray-500'>Castigate: {gamesWon}</span>
            <span className='text-sm text-gray-500 ml-2'>Pierdute: {gamesLost}</span>
            <span className='text-sm text-gray-500 ml-2'>Active: {gamesActive}</span>
            <span className='text-sm text-gray-500 ml-2 font-bold'>Procent castig: {percentWon}%</span>
        </div>
    );
}