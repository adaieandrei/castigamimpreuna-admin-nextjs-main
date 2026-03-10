import React from "react";
import { Button } from "flowbite-react";
import PropTypes from 'prop-types';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Game from "./Game";
import { GridPagination, GridToolbarTickets } from "./GridComponents";

function DateEditCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const dateValue = value ? new Date(value) : new Date();
    // Format for datetime-local input: YYYY-MM-DDTHH:MM
    const formatted = dateValue.getFullYear() + '-' +
        String(dateValue.getMonth() + 1).padStart(2, '0') + '-' +
        String(dateValue.getDate()).padStart(2, '0') + 'T' +
        String(dateValue.getHours()).padStart(2, '0') + ':' +
        String(dateValue.getMinutes()).padStart(2, '0');

    return (
        <input
            type="datetime-local"
            value={formatted}
            onChange={(e) => {
                const newDate = new Date(e.target.value);
                if (!isNaN(newDate.getTime())) {
                    apiRef.current.setEditCellValue({ id, field, value: newDate.getTime() });
                }
            }}
            style={{ width: '100%', padding: '0 8px', border: 'none', outline: 'none', fontSize: '0.85rem' }}
        />
    );
}

function OddEditCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const [inputValue, setInputValue] = React.useState(value != null ? String(value) : '');

    return (
        <input
            type="text"
            inputMode="decimal"
            autoFocus
            value={inputValue}
            onChange={(e) => {
                const raw = e.target.value.replace(',', '.');
                // Allow digits, one dot, and empty string while typing
                if (/^$|^\d+\.?\d*$/.test(raw)) {
                    setInputValue(raw);
                    const num = parseFloat(raw);
                    if (!isNaN(num)) {
                        apiRef.current.setEditCellValue({ id, field, value: num });
                    }
                }
            }}
            onBlur={() => {
                const num = parseFloat(inputValue);
                if (!isNaN(num)) {
                    apiRef.current.setEditCellValue({ id, field, value: num });
                }
            }}
            style={{ width: '100%', padding: '0 8px', border: 'none', outline: 'none', fontSize: '0.875rem' }}
        />
    );
}

export default function GridTickets(props) {
    const [tickets, setTickets] = React.useState([]);
    const [sortModel, setSortModel] = React.useState([
        { field: 'dateCreated', sort: 'desc' },
    ]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [ticket, setTicket] = React.useState(null);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    React.useEffect(() => {
        if (props) {
            setTickets(props.tickets)
            // console.log(props.tickets)
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
                        onClick={() => {
                            setTicket(cellValues.row)
                            handleOpenDialog()
                        }}
                    >
                        {cellValues.row.id}
                    </div>
                },
            },
            {
                field: 'totalGames',
                headerName: 'Numar meciuri',
                width: 100,
            },
            {
                field: 'totalOdd',
                headerName: 'Cota finala',
                width: 120,
                editable: true,
                renderEditCell: (params) => <OddEditCell {...params} />,
            },
            {
                field: 'userId',
                headerName: 'User ID',
                width: 200,
            },
            {
                field: 'device',
                headerName: 'Device',
                width: 80,
            },
            {
                field: 'appVersion',
                headerName: 'Versiune App',
                width: 100,
            },
            {
                field: 'codSuperbet',
                headerName: 'Cod Superbet',
                width: 120,
            },
            {
                field: 'dateCreated',
                headerName: 'Data crearii',
                width: 200,
                editable: true,
                renderEditCell: (params) => <DateEditCell {...params} />,
                valueFormatter: (params) => {
                    return new Date(params.value).toLocaleString('ro-RO');
                },
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 100,
                renderCell: (params) => {
                    switch (params.value) {
                        case "win":
                            return <span className='text-white bg-green-600 p-4 font-bold'>Win</span>
                        case "lost":
                            return <span className='text-white bg-red-600 p-4 font-bold'>Lost</span>
                        case "active":
                            return <span className='text-white bg-yellow-600 p-4 font-bold'>Active</span>
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
                                color="warning"
                                onClick={(event) => {
                                    handleUpdateTicket(event, cellValues);
                                }}
                            >
                                Actualizare Bilet
                            </Button>
                            <Button
                                color="failure"
                                onClick={(event) => {
                                    handleDeleteTicket(event, cellValues);
                                }}
                            >
                                Sterge Bilet
                            </Button>
                        </>
                    );
                }
            },
        ]

        const handleDeleteTicket = async (event, cellValues) => {
            const ticketRef = doc(firestoreDB, 'generated', cellValues.row.id)
            await deleteDoc(ticketRef)
        }

        const handleUpdateTicket = async (event, cellValues) => {
            let wins = 0
            let losses = 0

            for (const meci of cellValues.row.meciuri) {
                const meciRef = doc(firestoreDB, 'games', meci)
                const meciDoc = await getDoc(meciRef)
                const meciData = meciDoc.data()
                if (meciData.status === "win") {
                    wins++
                } else if (meciData.status === "lost") {
                    losses++
                }
            }

            if (losses) {
                const ticketRef = doc(firestoreDB, 'generated', cellValues.row.id)
                await updateDoc(ticketRef, {
                    status: "lost",
                    statistics: {
                        wins: wins,
                        losses: losses
                    }
                })
            } else if (wins === cellValues.row.meciuri.length) {
                const ticketRef = doc(firestoreDB, 'generated', cellValues.row.id)
                await updateDoc(ticketRef, {
                    status: "win",
                    statistics: {
                        wins: wins,
                        losses: losses
                    }
                })
            } else {
                const ticketRef = doc(firestoreDB, 'generated', cellValues.row.id)
                await updateDoc(ticketRef, {
                    status: "active",
                    statistics: {
                        wins: wins,
                        losses: losses
                    }
                })
            }
        }

        const handleCellClick = (param, event) => {
            event.stopPropagation();
        };

        const handleRowClick = (param, event) => {
            event.stopPropagation();
        };

        const processRowUpdate = async (newRow, oldRow) => {
            const changes = {}
            if (newRow.dateCreated !== oldRow.dateCreated) {
                changes.dateCreated = newRow.dateCreated
            }
            if (newRow.totalOdd !== oldRow.totalOdd) {
                changes.totalOdd = newRow.totalOdd
            }
            if (Object.keys(changes).length > 0) {
                await updateDoc(doc(firestoreDB, 'generated', newRow.id), changes)
            }
            return newRow
        }

        if (tickets.length !== 0) {
            return (
                <DataGrid
                    rows={tickets}
                    columns={gridColumns}
                    pageSize={25}
                    onCellClick={handleCellClick}
                    onRowClick={handleRowClick}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        // footer: GridFooter,
                        pagination: GridPagination,
                        toolbar: GridToolbarTickets,
                    }}
                    slotProps={{
                        toolbar: { tickets },
                    }}
                    initialState={{
                        ...tickets.initialState,
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

    }, [tickets, sortModel])

    return (
        <>
            <div style={{ height: '70vh', width: '100%' }}>
                {tickets.length !== 0 ? displayGrid() : <h1 className="text-2xl text-center">Se incarca biletele...</h1>}
            </div>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Bilet {ticket && ticket.id}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    {ticket && ticket.meciuri.map((meci, index) => {
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