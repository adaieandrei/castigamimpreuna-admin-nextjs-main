import { useState, useEffect } from 'react';
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'

export default function GridToolbarPayments(props) {

    useEffect(() => {

    }, [props])
    return (
        <div className='flex flex-row justify-end border-b p-2'>
            <span className='text-sm text-gray-500'>Platite: </span>
            <span className='text-sm text-gray-500 ml-2'>In asteptare: </span>
            <span className='text-sm text-gray-500 ml-2 font-bold'>Total suma: </span>
        </div>
    );
}