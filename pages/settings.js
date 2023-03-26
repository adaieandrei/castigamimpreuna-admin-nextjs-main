import React from 'react'
import { config } from '../config'

export default function Settings() {
    const [LAapiKey, setLAApiKey] = React.useState("Click to reveal")

    const revealAPIKey = () => () => {
        setLAApiKey(config.laApiKey)
        setTimeout(() => {
            setLAApiKey("Click to reveal")
        }, 30000)
    }

    return (
        <div>
            <h1>Setari</h1>
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <div className='flex flex-row'>
                        LA API Key:&nbsp;
                        <span className="text-red-500 cursor-pointer" onClick={revealAPIKey()}>
                            {LAapiKey}
                        </span>
                    </div>
                    <div className='flex flex-row'>
                        Termeni si conditii &nbsp;
                        <div className='flex flex-col'>
                            <textarea className="w-96 h-96"></textarea>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Salveaza</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}