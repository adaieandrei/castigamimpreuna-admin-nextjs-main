import React from 'react'
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'
import GridPayments from '../components/GridPayments'
import Head from 'next/head'
import { Button } from 'flowbite-react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Payments() {
    const [payments, setPayments] = React.useState([])
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

    const handleClickSnackbar = () => {
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    React.useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(firestoreDB, "payments")), (querySnapshot) => {
            const data = []
            querySnapshot.forEach((doc) => {
                const docData = doc.data()
                // console.log(docData)
                const item = {}
                item.id = doc.id
                item.userId = docData.userId
                item.amount = docData.amount
                item.createdAt = parseInt(docData.createdAt)
                item.currency = docData.currency
                item.intervalCount = docData.intervalCount
                item.paymentMethod = docData.method
                item.paysafeCode = docData.paysafeCode
                item.price = docData.price
                item.status = docData.status
                data.push(item)
            })
            // console.log(data)
            data.sort((a, b) => {
                return b.createdAt - a.createdAt
            })
            setPayments(data)
        })
        return unsubscribe
    }, [])







    return (
        <>
            <Head>
                <title>Utilizatori - Admin</title>
            </Head>
            <div className="flex flex-row gap-2">
            </div>

            <GridPayments payments={payments} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={10000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}