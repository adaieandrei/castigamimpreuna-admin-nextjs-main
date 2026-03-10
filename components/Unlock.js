import Head from 'next/head'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Layout from './Layout';

export default function Unlock({ children }) {
    const [unlock, setUnlock] = React.useState(false)

    React.useEffect(() => {
        //check if session is in local storage
        let lastLogin = localStorage.getItem("lastLogin")
        if (lastLogin) {
            //check if session is valid
            let now = new Date().getTime()
            let diff = now - lastLogin
            if (diff < 1000 * 60 * 60 * 24) {
                setUnlock(true)
            }
        }
    }, [setUnlock])

    const checkPasword = (event) => {
        if (event == "Par0la132#@") {
            //add session to local storage
            localStorage.setItem("lastLogin", new Date().getTime())
            setUnlock(true)
        }
    }

    if (unlock) {
        return (
            <>
                <Layout>
                    {children}
                </Layout>
            </>
        )
    }
    else {
        return (
            <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
                <Head>
                    <title>Admin - Câștigă Împreună</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-green-700">Câștigă Împreună</h1>
                        <p className="text-sm text-gray-500 mt-1">Panou de administrare</p>
                    </div>
                    <TextField
                        id="outlined-password-input"
                        label="Parolă"
                        type="password"
                        autoComplete="current-password"
                        fullWidth
                        onChange={(event) => checkPasword(event.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: '#16a34a' },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#16a34a' },
                        }}
                    />
                </div>
            </div>
        )
    }
}
