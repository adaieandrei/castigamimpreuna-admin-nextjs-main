import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as React from 'react';
import Box from '@mui/material/Box';
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
            <div className={styles.container}>
                <Head>
                    <title>Bilete Random</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(event) => checkPasword(event.target.value)}
                    />
                </main>

                <footer className={styles.footer}>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by{' '}
                        <span className={styles.logo}>
                            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                        </span>
                    </a>
                </footer>
            </div>
        )
    }
}
