import React from "react";
import Link from "next/link";
import { Button } from "flowbite-react";
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

export default function Layout({ children }) {
    const router = useRouter()
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return (
        <div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row">
                    <Button.Group>
                        <Button color="gray" onClick={() => router.push('/')}>
                            Dashboard
                        </Button>
                        <Button color="gray" onClick={() => router.push('/games')}>
                            Meciuri
                        </Button>
                        <Button color="gray" onClick={() => router.push('/tickets')}>
                            Bilete
                        </Button>
                        <Button color="gray" onClick={() => router.push('/users')}>
                            Utilizatori
                        </Button>
                        <Button color="gray" onClick={() => router.push('/payments')}>
                            Plati
                        </Button>
                        <Button color="gray" onClick={() => router.push('/settings')}>
                            Setari
                        </Button>
                    </Button.Group>
                </div>
                <div className="flex flex-row">
                    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </div>

            </div>
            {children}
        </div>
    )
}