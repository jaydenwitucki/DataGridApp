import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useWebSocket } from '../hooks/useWebSocket';

const DataGridComponent = ({ rows }) => {
  // Define columns for the DataGrid
  const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', width: 150 },
      // Add more columns based on your data model
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
              // Adding row id getter if your row data might not include an 'id' field
              getRowId={(row) => row.id}
              // Provide a loading state or empty row message
              loading={safeRows.length === 0}
              noRowsOverlay={<div>No data available</div>}
          />
      </div>
  );
};



export default DataGridComponent;