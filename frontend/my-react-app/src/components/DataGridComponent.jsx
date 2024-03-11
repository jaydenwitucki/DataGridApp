import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const DataGridComponent = ({ rows, onDelete }) => {
  // Define columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    // Add a column for delete actions
    {
      field: 'delete',
      headerName: 'Delete',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the cell
            onDelete(params.row.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];
  
  // Ensure rows is always an array to prevent rendering issues
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={safeRows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        getRowId={(row) => row.id}
        loading={safeRows.length === 0}
        // Removed the noRowsOverlay prop for simplicity, implement as needed
      />
    </div>
  );
};




export default DataGridComponent;