import React from 'react'
import Image from 'next/image'
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'

export default function Game(props) {
    const [game, setGame] = React.useState(null)

    React.useEffect(() => {
        if (props.game) {
            // console.log(props.game)
            const getGame = async () => {
                const gameRef = doc(firestoreDB, 'games', props.game)
                const gameSnapshot = await getDoc(gameRef)
                const gameData = gameSnapshot.data()
                if (gameData) {
                    setGame(gameData)
                }
            }
            getGame()
        }
    }, [props])

    return (
        <>
            {game ? (
                <div className={('flex flex-col border rounded-sm mb-2 ') + (game.status == "win" ? 'border-green-500' : '') + (game.status == 'lost' ? 'border-red-600' : '') + (game.status == 'active' ? 'border-orange-400' : '')}>
                    <div className='flex flex-row justify-start items-center p-2'>
                        <div className='w-4 h-4 mr-2'>
                            <Image
                                src={game.flag}
                                alt={game.countryName}
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-auto" />
                        </div>
                        <div>
                            {game.day} - {game.countryLeague}
                        </div>
                    </div>
                    <div className='flex flex-row justify-start items-start p-2'>
                        <div className='mr-2'>
                            {game.hour}
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-row'>
                                {game.team1}
                            </div>
                            <div className='flex flex-row'>
                                {game.team2}
                            </div>
                        </div>
                    </div>
                    <hr className='border-gray-300 dark:border-black-700' />
                    <div className='flex flex-row justify-between p-2'>
                        <div className='flex flex-row'>
                            {game.marketName}
                        </div>
                        <div className='flex flex-row'>
                            {game.market}
                        </div>
                        <div className='flex flex-row'>
                            {game.odd}
                        </div>
                    </div>
                </div>
            ) :
                (
                    <div role="status" className="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div>
                                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>
                )}
        </>
    )
}