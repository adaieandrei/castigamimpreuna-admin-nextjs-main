import Head from 'next/head'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Layout from './Layout';

const BALLS = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.round((i * 37 + 11) % 100)}%`,
    size: 18 + (i % 5) * 10,
    duration: 12 + (i % 7) * 3,
    delay: -((i * 2.3) % 15),
    opacity: 0.08 + (i % 4) * 0.04,
}));

export default function Unlock({ children }) {
    const [unlock, setUnlock] = React.useState(false)
    const [shake, setShake] = React.useState(false)

    React.useEffect(() => {
        let lastLogin = localStorage.getItem("lastLogin")
        if (lastLogin) {
            let now = new Date().getTime()
            let diff = now - lastLogin
            if (diff < 1000 * 60 * 60 * 24) {
                setUnlock(true)
            }
        }
    }, [setUnlock])

    const checkPasword = (event) => {
        if (event == "Par0la132#@") {
            localStorage.setItem("lastLogin", new Date().getTime())
            setUnlock(true)
        } else if (event.length >= 5) {
            setShake(true)
            setTimeout(() => setShake(false), 500)
        }
    }

    if (unlock) {
        return (
            <Layout>
                {children}
            </Layout>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 30%, #059669 60%, #10b981 100%)' }}>
            <Head>
                <title>Admin - Câștigă Împreună</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <style jsx>{`
                @keyframes floatUp {
                    0% { transform: translateY(100vh) rotate(0deg); }
                    100% { transform: translateY(-120px) rotate(720deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
                .shake { animation: shake 0.5s ease-in-out; }
            `}</style>

            {/* Floating football pattern */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Field lines */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }} />
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/10" />

                {/* Floating footballs */}
                {BALLS.map(b => (
                    <div key={b.id} className="absolute" style={{
                        left: b.left,
                        bottom: '-60px',
                        width: b.size,
                        height: b.size,
                        opacity: b.opacity,
                        animation: `floatUp ${b.duration}s linear ${b.delay}s infinite`,
                    }}>
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="48" fill="white" stroke="white" strokeWidth="2"/>
                            <polygon points="50,15 65,35 58,55 42,55 35,35" fill="rgba(0,0,0,0.15)"/>
                            <polygon points="50,15 35,35 15,30" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2"/>
                            <polygon points="50,15 65,35 80,25" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2"/>
                            <polygon points="65,35 58,55 80,60" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2"/>
                            <polygon points="42,55 35,35 18,50" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2"/>
                            <polygon points="42,55 58,55 50,75" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2"/>
                        </svg>
                    </div>
                ))}
            </div>

            {/* Card */}
            <div className={`relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 ${shake ? 'shake' : ''}`}>
                {/* Football icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="45" fill="white" stroke="white" strokeWidth="2"/>
                            <polygon points="50,18 63,34 57,52 43,52 37,34" fill="#16a34a"/>
                            <line x1="50" y1="18" x2="37" y2="34" stroke="#16a34a" strokeWidth="2"/>
                            <line x1="50" y1="18" x2="63" y2="34" stroke="#16a34a" strokeWidth="2"/>
                            <line x1="63" y1="34" x2="57" y2="52" stroke="#16a34a" strokeWidth="2"/>
                            <line x1="43" y1="52" x2="37" y2="34" stroke="#16a34a" strokeWidth="2"/>
                            <line x1="43" y1="52" x2="57" y2="52" stroke="#16a34a" strokeWidth="2"/>
                            <line x1="50" y1="18" x2="50" y2="5" stroke="#d1d5db" strokeWidth="1.5"/>
                            <line x1="63" y1="34" x2="78" y2="25" stroke="#d1d5db" strokeWidth="1.5"/>
                            <line x1="57" y1="52" x2="75" y2="60" stroke="#d1d5db" strokeWidth="1.5"/>
                            <line x1="43" y1="52" x2="25" y2="60" stroke="#d1d5db" strokeWidth="1.5"/>
                            <line x1="37" y1="34" x2="22" y2="25" stroke="#d1d5db" strokeWidth="1.5"/>
                        </svg>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Bine ai venit Lucas! ⚽
                    </h1>
                    <p className="text-base text-gray-500 mt-2">
                        Baga parola sefu sa treci mai departe 😎
                    </p>
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
                            borderRadius: '12px',
                            '& fieldset': { borderColor: '#d1d5db' },
                            '&:hover fieldset': { borderColor: '#16a34a' },
                            '&.Mui-focused fieldset': { borderColor: '#16a34a' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#16a34a' },
                    }}
                />

                <p className="text-xs text-center text-gray-400 mt-6">
                    Câștigă Împreună &bull; Admin Panel
                </p>
            </div>
        </div>
    )
}
