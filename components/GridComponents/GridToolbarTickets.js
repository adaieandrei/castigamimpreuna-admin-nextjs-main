import { useState, useEffect } from 'react';
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'

export default function GridToolbar(props) {
    //count how many lost and won and active games
    const [ticketsWon, setTicketsWon] = useState(0);
    const [ticketsLost, setTicketsLost] = useState(0);
    const [ticketsActive, setTicketsActive] = useState(0);
    const [percentWon, setPercentWon] = useState(0);

    useEffect(() => {
        if (props) {
            let won = 0;
            let lost = 0;
            let active = 0;
            let percent = 0;
            props.tickets.forEach((ticket) => {
                if (ticket.status === 'win') {
                    won++;
                } else if (ticket.status === 'lost') {
                    lost++;
                } else {
                    active++;
                }
            })
            percent = Math.round((won / (won + lost)) * 100);
            setPercentWon(percent);
            setTicketsWon(won);
            setTicketsLost(lost);
            setTicketsActive(active);
            // setDoc(doc(firestoreDB, 'stats', 'tickets'), {
            //     won: won,
            //     lost: lost,
            //     active: active,
            //     percent: percent,
            //     info: "Last 3 days"
            // }, { merge: true })
        }
    }, [props])
    return (
        <div className='flex flex-row justify-end border-b p-2'>
            <span className='text-sm text-gray-500'>Castigate: {ticketsWon}</span>
            <span className='text-sm text-gray-500 ml-2'>Pierdute: {ticketsLost}</span>
            <span className='text-sm text-gray-500 ml-2'>Active: {ticketsActive}</span>
            <span className='text-sm text-gray-500 ml-2 font-bold'>Procent castig: {percentWon}%</span>
        </div>
    );
}