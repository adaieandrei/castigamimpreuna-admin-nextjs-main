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
import { GridPagination, GridToolbarUsers } from "./GridComponents";

export default function GridUsers(props) {
    const [users, setUsers] = React.useState([]);
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
            setUsers(props.users)
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
                field: 'username',
                headerName: 'Username',
                width: 150,
            },
            {
                field: 'phoneNumber',
                headerName: 'Numar telefon',
                width: 130,
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
                field: 'lastSignInTime',
                headerName: 'Ultimul login',
                width: 200,
                valueFormatter: (params) => {
                    return new Date(params.value).toLocaleString();
                },
            },
            {
                field: 'subscriptionStart',
                headerName: 'Inceput abonament',
                width: 200,
                valueFormatter: (params) => {
                    if (params.value) {
                        return new Date(params.value * 1000).toLocaleString();
                    }
                },
            },
            {
                field: 'subscriptionEnd',
                headerName: 'Sfarsit abonament',
                width: 200,
                valueFormatter: (params) => {
                    if (params.value) {
                        return new Date(params.value * 1000).toLocaleString();
                    }
                },
            },
            {
                field: 'subscriptionInterval',
                headerName: 'Perioada abonament',
                width: 200,
                valueFormatter: (params) => {
                    if (params.value) {
                        return params.value + ' luni'
                    }
                },
            },
            {
                field: 'subscriptionStatus',
                headerName: 'Status abonament',
                width: 200,
                renderCell: (params) => {
                    switch (params.value) {
                        case "activ":
                            return <span className='text-white bg-green-600 p-4 font-bold'>Activ</span>
                        case "inactiv":
                            return <span className='text-white bg-red-600 p-4 font-bold'>Inactiv</span>
                        default:
                            return <span className='text-white bg-gray-600 p-4 font-bold'>Undefined</span>
                    }
                },
            },
            {
                field: "action",
                headerName: "Action",
                width: 300,
                sortable: false,
                renderCell: (cellValues) => {
                    return (
                        <>
                            <Button
                                color="failure"
                                onClick={(event) => {
                                }}
                            >
                                Anulare abonament
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

        if (users.length !== 0) {
            return (
                <DataGrid
                    rows={users}
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
                        toolbar: GridToolbarUsers,
                    }}
                    slotProps={{
                        toolbar: { users: users },
                    }}
                    initialState={{
                        ...users.initialState,
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
                    <h1 className="text-2xl text-center">Se incarca biletele...</h1>
                </div>
            )
        }

    }, [users, sortModel])

    return (
        <>
            <div style={{ height: '70vh', width: '100%' }}>
                {users.length !== 0 ? displayGrid() : <h1 className="text-2xl text-center">Se incarca biletele...</h1>}
            </div>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Bilet {user && user.id}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    {user && user.meciuri.map((meci, index) => {
                        return <Game key={index} game={meci} />
                    })}
                </DialogContent>
                <DialogActions>
                    <div onClick={handleCloseDialog}>Close</div>
                </DialogActions>
            </Dialog>
        </>
    )

}