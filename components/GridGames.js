import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from 'flowbite-react';
import moment from 'moment'
import { width } from '@mui/system';
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import { GridPagination, GridToolbarGames } from './GridComponents';

const GridGames = (props) => {
    const [meciuri, setMeciuri] = useState([]);
    const [won, setGamesWon] = useState(22);
    const [sortModel, setSortModel] = useState([
        { field: 'timestamp', sort: 'desc' },
    ]);

    useEffect(() => {
        if (props) {
            setMeciuri(props.data)
        }
    }, [props])

    const handleCellClick = (param, event) => {
        event.stopPropagation();
    };

    const handleRowClick = (param, event) => {
        event.stopPropagation();
    };

    const afisare = useCallback(() => {
        const gridColumns = [
            {
                field: 'flag',
                headerName: 'Steag',
                width: 50,
                renderCell: (cellValues) => {
                    return <img src={cellValues.row.flag} alt="flag" />
                },

            },

            {
                field: 'shopCode',
                headerName: 'Cod',
                width: 110,
            },
            {
                field: 'team1',
                headerName: 'Echipa 1',
                width: 200
            },
            {
                field: 'team2',
                headerName: 'Echipa 2',
                width: 200
            },
            {
                field: 'day',
                headerName: 'Ziua',
                width: 110,
            },
            {
                field: 'hour',
                headerName: 'Ora',
                width: 110
            },
            {
                field: 'marketName',
                headerName: 'Piata',
                width: 200
            },
            {
                field: 'market',
                headerName: 'Pariu',
                width: 120
            },
            {
                field: 'odd',
                headerName: 'Cota',
                width: 110
            },
            {
                field: 'grade',
                headerName: 'Nota',
                width: 70
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 120,
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
                // valueGetter: params => {
                //     return params.data.status;
                // },
                // valueSetter: params => {
                //     params.data.status = params.newValue;
                //     return true;
                // }

            },
            {
                field: 'timestamp',
                headerName: 'Timestamp',
                width: 200,
                valueFormatter: (params) => {
                    return new Date(params.value).toLocaleString();
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
                                color="success"
                                onClick={(event) => {
                                    handleClickWin(event, cellValues);
                                }}
                            >
                                Win
                            </Button>
                            <Button
                                color="warning"
                                onClick={(event) => {
                                    handleClickActive(event, cellValues);
                                }}
                            >
                                Active
                            </Button>
                            <Button
                                color="dark"
                                onClick={(event) => {
                                    handleClickLost(event, cellValues);
                                }}
                            >
                                Lost
                            </Button>
                            <Button
                                color="failure"
                                onClick={(event) => {
                                    handleClickDelete(event, cellValues);
                                }}
                            >
                                Delete
                            </Button>

                        </>
                    );
                }
            },

        ]
        const handleClickWin = (event, cellValues) => {
            const gameRef = doc(firestoreDB, 'games', cellValues.row.id)
            updateDoc(gameRef, { status: 'win' })
        }
        const handleClickActive = (event, cellValues) => {
            const gameRef = doc(firestoreDB, 'games', cellValues.row.id)
            updateDoc(gameRef, { status: 'active' })
        }
        const handleClickLost = (event, cellValues) => {
            const gameRef = doc(firestoreDB, 'games', cellValues.row.id)
            updateDoc(gameRef, { status: 'lost' })
        }
        const handleClickDelete = (event, cellValues) => {
            deleteDoc(doc(firestoreDB, 'games', cellValues.row.id))
            // .then(() => {
            //     const items = [...meciuri.slice(0, cellValues.row.id), ...meciuri.slice(cellValues.row.id + 1)]
            //     setMeciuri(items)
            // })
        }
        if (meciuri.length !== 0) {
            return <DataGrid
                rows={meciuri}
                columns={gridColumns}
                sortModel={sortModel}
                onCellClick={handleCellClick}
                onRowClick={handleRowClick}
                onSortModelChange={(model) => setSortModel(model)}
                experimentalFeatures={{ newEditingApi: true }}
                // pagination
                slots={{
                    // footer: GridFooter,
                    pagination: GridPagination,
                    toolbar: GridToolbarGames,
                }}
                slotProps={{
                    toolbar: { meciuri },
                }}
                initialState={{
                    ...meciuri.initialState,
                    pagination: {
                        paginationModel: {
                            pageSize: 100,
                        },
                    },
                }}
            />
        } else {
            return <div>Nu exista meciuri</div>
        }

    }, [meciuri, sortModel])



    useEffect(() => {

        afisare()

    }, [afisare])


    return (
        <div>
            <div style={{ height: '70vh', width: '100%' }}>
                {meciuri.length !== 0 ? afisare() : <h1 className="text-2xl text-center">Se incarca meciurile...</h1>}
            </div>
        </div>
    )
}

export default GridGames