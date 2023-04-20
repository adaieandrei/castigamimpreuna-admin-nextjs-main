import React from "react";
import { Button } from "flowbite-react";
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Game from "./Game";
import { GridPagination, GridToolbarPayments } from "./GridComponents";

export default function GridPayments(props) {
    const [payments, setPayments] = React.useState([]);
    const [sortModel, setSortModel] = React.useState([
        { field: 'createdAt', sort: 'desc' },
    ]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [user, setUser] = React.useState(null);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    React.useEffect(() => {
        if (props) {
            // console.log(props.users)
            setPayments(props.payments)
        }
    }, [props])

    const displayGrid = React.useCallback(() => {
        const gridColumns = [
            {
                field: 'id',
                headerName: 'ID',
                width: 200,
                renderCell: (cellValues) => {
                    return <div
                        className='text-black dark:text-white p-4 cursor-pointer'
                    // onClick={() => {
                    //     setUser(cellValues.row)
                    //     // handleOpenDialog()
                    // }}
                    >
                        {cellValues.row.id}
                    </div>
                },
            },
            {
                field: 'userId',
                headerName: 'User ID',
                width: 200,
            },
            {
                field: 'createdAt',
                headerName: 'Creat la',
                width: 200,
                valueFormatter: (params) => {
                    return new Date(params.value).toLocaleString();
                },
            },
            {
                field: 'paymentMethod',
                headerName: 'Metoda de plata',
                width: 150,
            },
            {
                field: 'amount',
                headerName: 'Suma',
                width: 80,
                valueFormatter: (params) => {
                    if (params.value) {
                        return (params.value / 100).toFixed(2)
                    }
                },
            },
            {
                field: 'currency',
                headerName: 'Moneda',
                width: 80,
                valueFormatter: (params) => {
                    if (params.value) {
                        return params.value.toUpperCase()
                    }
                },
            },
            {
                field: 'intervalCount',
                headerName: 'Perioada',
                width: 80,
                valueFormatter: (params) => {
                    if (params.value) {
                        return params.value + ' luni'
                    }
                },
            },
            {
                field: 'paysafeCode',
                headerName: 'Cod PaySafe',
                width: 200,
            },
            {
                field: 'status',
                headerName: 'Status plata',
                width: 200,
                renderCell: (params) => {
                    switch (params.value) {
                        case "paid":
                            return <span className='text-white bg-green-600 p-4 font-bold'>Platit</span>
                        case "pending":
                            return <span className='text-white bg-yellow-600 p-4 font-bold'>In asteptare</span>
                        case "open":
                            return <span className='text-white bg-red-600 p-4 font-bold'>Neplatita</span>
                        default:
                            return <span className='text-white bg-gray-600 p-4 font-bold'>Undefined</span>
                    }
                },
            },
            {
                field: "action",
                headerName: "Action",
                width: 600,
                sortable: false,
                renderCell: (cellValues) => {
                    return (
                        <>
                            <Button
                                color="success"
                                onClick={(event) => {
                                }}
                            >
                                Accepta abonament 1
                            </Button>
                            <Button
                                color="warning"
                                onClick={(event) => {
                                }}
                            >
                                Accepta abonament 3
                            </Button>
                            <Button
                                color="failure"
                                onClick={(event) => {
                                }}
                            >
                                Accepta abonament 6
                            </Button>
                        </>
                    );
                }
            },
        ]


        const handleCellClick = (param, event) => {
            event.stopPropagation();
        };

        const handleRowClick = (param, event) => {
            event.stopPropagation();
        };

        if (payments.length !== 0) {
            return (
                <DataGrid
                    rows={payments}
                    columns={gridColumns}
                    pageSize={25}
                    onCellClick={handleCellClick}
                    onRowClick={handleRowClick}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                    experimentalFeatures={{ newEditingApi: true }}
                    slots={{
                        // footer: GridFooter,
                        pagination: GridPagination,
                        toolbar: GridToolbarPayments,
                    }}
                    slotProps={{
                        toolbar: { payments: payments },
                    }}
                    initialState={{
                        ...payments.initialState,
                        pagination: {
                            paginationModel: {
                                pageSize: 100,
                            },
                        },
                    }}
                />
            )
        } else {
            return (
                <div>
                    <h1 className="text-2xl text-center">Se incarca platile...</h1>
                </div>
            )
        }

    }, [payments, sortModel])

    return (
        <>
            <div style={{ height: '70vh', width: '100%' }}>
                {payments.length !== 0 ? displayGrid() : <h1 className="text-2xl text-center">Se incarca platile...</h1>}
            </div>
        </>
    )

}