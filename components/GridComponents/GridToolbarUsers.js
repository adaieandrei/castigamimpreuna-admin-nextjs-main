import { useState, useEffect } from 'react';
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'

export default function GridToolbarUsers(props) {
    const [activeUsers, setActiveUsers] = useState(0);
    const [inactiveUsers, setInactiveUsers] = useState(0);
    const [percentActive, setPercentActive] = useState(0);

    useEffect(() => {
        if (props) {
            let active = 0;
            let inactive = 0;
            props.users.forEach((user) => {
                if (user.subscriptionStatus === 'activ') {
                    active++;
                } else {
                    inactive++;
                }
            })
            setActiveUsers(active);
            setInactiveUsers(inactive);
            setPercentActive(Math.round((active / (active + inactive)) * 100));
        }
    }, [props])
    return (
        <div className='flex flex-row justify-end border-b p-2'>
            <span className='text-sm text-gray-500'>Abonati: {activeUsers}</span>
            <span className='text-sm text-gray-500 ml-2'>Inactivi: {inactiveUsers}</span>
            <span className='text-sm text-gray-500 ml-2 font-bold'>Procent activi: {percentActive}%</span>
        </div>
    );
}