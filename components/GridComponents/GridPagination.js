import PropTypes from 'prop-types';
import {
    DataGrid, GridOverlay, GridColDef, GridApi, GridCellValue, gridPageCountSelector,
    GridPagination,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';

function Pagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <MuiPagination
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event, newPage - 1);
            }}
        />
    );
}

Pagination.propTypes = {
    className: PropTypes.string,
    /**
     * Callback fired when the page is changed.
     *
     * @param {React.MouseEvent<HTMLButtonElement> | null} event The event source of the callback.
     * @param {number} page The page selected.
     */
    onPageChange: PropTypes.func.isRequired,
    /**
     * The zero-based index of the current page.
     */
    page: PropTypes.number.isRequired,
};

export default function CustomPagination(props) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
}