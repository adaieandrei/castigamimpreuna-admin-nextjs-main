import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Chip from '@mui/material/Chip';
import { firestoreDB } from '../firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { GridPagination, GridToolbarGames } from './GridComponents';

const statusConfig = {
    win: { label: 'Win', color: 'success' },
    lost: { label: 'Lost', color: 'error' },
    active: { label: 'Active', color: 'warning' },
};

const GridGames = (props) => {
    const [meciuri, setMeciuri] = useState([]);
    const [sortModel, setSortModel] = useState([
        { field: 'timestamp', sort: 'desc' },
    ]);

    useEffect(() => {
        if (props?.data) {
            setMeciuri(props.data);
        }
    }, [props]);

    const handleStatusChange = useCallback((id, status) => {
        updateDoc(doc(firestoreDB, 'games', id), { status });
    }, []);

    const handleDelete = useCallback((id) => {
        deleteDoc(doc(firestoreDB, 'games', id));
    }, []);

    const gridColumns = useMemo(() => [
        {
            field: 'flag',
            headerName: '',
            width: 45,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt=""
                    style={{ width: 22, height: 16, objectFit: 'cover', borderRadius: 2 }}
                />
            ),
        },
        {
            field: 'countryLeague',
            headerName: 'Liga',
            flex: 0.8,
            minWidth: 130,
        },
        {
            field: 'team1',
            headerName: 'Echipa 1',
            flex: 1,
            minWidth: 140,
            renderCell: (params) => (
                <span className="font-medium">{params.value}</span>
            ),
        },
        {
            field: 'team2',
            headerName: 'Echipa 2',
            flex: 1,
            minWidth: 140,
            renderCell: (params) => (
                <span className="font-medium">{params.value}</span>
            ),
        },
        {
            field: 'day',
            headerName: 'Data',
            width: 100,
        },
        {
            field: 'hour',
            headerName: 'Ora',
            width: 70,
        },
        {
            field: 'marketName',
            headerName: 'Piață',
            flex: 0.7,
            minWidth: 120,
        },
        {
            field: 'market',
            headerName: 'Pariu',
            width: 100,
        },
        {
            field: 'odd',
            headerName: 'Cotă',
            width: 70,
            renderCell: (params) => (
                <span className="font-bold text-blue-700">{params.value}</span>
            ),
        },
        {
            field: 'grade',
            headerName: 'Notă',
            width: 60,
            renderCell: (params) => {
                const v = Number(params.value);
                const color = v >= 70 ? 'text-emerald-600' : v >= 40 ? 'text-amber-600' : 'text-red-600';
                return <span className={`font-semibold ${color}`}>{params.value}</span>;
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => {
                const cfg = statusConfig[params.value] || { label: params.value, color: 'default' };
                return <Chip label={cfg.label} color={cfg.color} size="small" variant="filled" />;
            },
        },
        {
            field: 'timestamp',
            headerName: 'Adăugat',
            width: 150,
            valueFormatter: (params) => {
                if (!params.value) return '';
                return new Date(params.value).toLocaleString('ro-RO', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            },
        },
        {
            field: 'actions',
            headerName: 'Acțiuni',
            width: 160,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Tooltip title="Marcare Win">
                        <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleStatusChange(params.row.id, 'win')}
                        >
                            <CheckCircleIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Marcare Active">
                        <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleStatusChange(params.row.id, 'active')}
                        >
                            <RadioButtonCheckedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Marcare Lost">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleStatusChange(params.row.id, 'lost')}
                        >
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Șterge">
                        <IconButton
                            size="small"
                            sx={{ color: '#666' }}
                            onClick={() => handleDelete(params.row.id)}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ], [handleStatusChange, handleDelete]);

    if (meciuri.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Se încarcă meciurile...</p>
            </div>
        );
    }

    return (
        <Box sx={{
            height: '75vh',
            width: '100%',
            '& .MuiDataGrid-root': {
                border: 'none',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
            },
            '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f0fdf4',
                borderBottom: '2px solid #dcfce7',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                color: '#15803d',
            },
            '& .MuiDataGrid-row': {
                '&:hover': {
                    backgroundColor: '#f0fdf4',
                },
            },
            '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0fdf4',
                display: 'flex',
                alignItems: 'center',
            },
        }}>
            <DataGrid
                rows={meciuri}
                columns={gridColumns}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                disableRowSelectionOnClick
                density="comfortable"
                slots={{
                    pagination: GridPagination,
                    toolbar: GridToolbarGames,
                }}
                slotProps={{
                    toolbar: { meciuri },
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 50 },
                    },
                }}
                pageSizeOptions={[25, 50, 100]}
            />
        </Box>
    );
};

export default GridGames;