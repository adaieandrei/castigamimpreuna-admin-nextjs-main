import React from 'react'
import Head from 'next/head';
import { config } from '../config'
import { DefaultEditor } from 'react-simple-wysiwyg';
import { firestoreDB } from '../firebase'
import { doc, setDoc, query, collection, getDoc } from 'firebase/firestore'

export default function Settings() {
    const [LAapiKey, setLAApiKey] = React.useState("Click to reveal")
    const [termsAndConditionsRO, setTermsAndConditionsRO] = React.useState("")
    const [termsAndConditionsEN, setTermsAndConditionsEN] = React.useState("")
    const [versionRO, setVersionRO] = React.useState(1)
    const [versionEN, setVersionEN] = React.useState(1)

    const revealAPIKey = () => () => {
        setLAApiKey(config.laApiKey)
        setTimeout(() => {
            setLAApiKey("Click to reveal")
        }, 30000)
    }

    const handleSaveTermsAndConditionsRO = () => {
        setDoc(doc(firestoreDB, "settings", "legal"), {
            termsAndConditions: {
                ro: {
                    text: termsAndConditionsRO,
                    title: "Termeni si Conditii",
                    version: versionRO + 1,
                    language: "Română",
                    lastUpdate: new Date()
                }
            }
        }, { merge: true })
    }

    const handleSaveTermsAndConditionsEN = () => {
        setDoc(doc(firestoreDB, "settings", "legal"), {
            termsAndConditions: {
                en: {
                    text: termsAndConditionsEN,
                    title: "Terms and Conditions",
                    version: versionEN + 1,
                    language: "English",
                    lastUpdate: new Date()
                }
            }
        }, { merge: true })
    }

    React.useEffect(() => {
        const getTermsAndConditions = async () => {
            const termsAndConditionsDoc = await getDoc(doc(firestoreDB, "settings", "legal"))
            if (termsAndConditionsDoc.exists()) {
                setTermsAndConditionsRO(termsAndConditionsDoc.data().termsAndConditions?.ro?.text)
                setTermsAndConditionsEN(termsAndConditionsDoc.data().termsAndConditions?.en?.text)
                setVersionRO(termsAndConditionsDoc.data().termsAndConditions?.ro?.version)
                setVersionEN(termsAndConditionsDoc.data().termsAndConditions?.en?.version)

            }
        }
        getTermsAndConditions()
    }, [])

    return (
        <div>
            <Head>
                <title>Setari</title>
            </Head>
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <div className='flex flex-row'>
                        LA API Key:&nbsp;
                        <span className="text-red-500 cursor-pointer" onClick={revealAPIKey()}>
                            {LAapiKey}
                        </span>
                    </div>
                    <div className='flex flex-row'>
                        Termeni si conditii &nbsp; RO
                        <div className='flex flex-col'>
                            <div className="w-full">
                                <DefaultEditor value={termsAndConditionsRO} onChange={(e) => setTermsAndConditionsRO(e.target.value)} />
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleSaveTermsAndConditionsRO}
                                >Salveaza</button>
                            </div>

                        </div>
                    </div>
                    <div className='flex flex-row'>
                        Termeni si conditii &nbsp; EN
                        <div className='flex flex-col'>
                            <div className="w-full">
                                <DefaultEditor value={termsAndConditionsEN} onChange={(e) => setTermsAndConditionsEN(e.target.value)} />
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleSaveTermsAndConditionsEN}
                                >Salveaza</button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}