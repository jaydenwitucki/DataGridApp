import { AppBar, Toolbar, Typography, Container, TextField, Button } from '@mui/material';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useCallback, useEffect} from 'react';
import DataGridComponent from './components/DataGridComponent'; // Adjust the import path as needed
/*import { useWebSocket } from './hooks/useWebSocket'; // Adjust the import path as needed */
import useWebSocket from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';

const newItemId = uuidv4();


function App() {
  const [rows, setRows] = useState([]);
  const [itemName, setItemName] = useState('');

  // Example WebSocket send message function
  // Adjust according to your `useWebSocket` hook implementation
  const socketUrl = 'ws://localhost:5000/ws';

  // Options for react-use-websocket
  const options = {
    onMessage: (event) => {
      const parsedMessage = JSON.parse(event.data);

      if (parsedMessage.type === 'getAll') {
        setRows(parsedMessage.data);
      } else if (parsedMessage.type === 'addConfirmation') {
        // Update or confirm addition here, using data from server if necessary
        setRows(currentRows => [...currentRows, parsedMessage.data]);
      }
      // Handle other operations like update, delete confirmation
    },
    // Additional options like shouldReconnect can be added here
  };

  const { sendMessage } = useWebSocket(socketUrl, options);

  // Function to handle adding items
  const handleAddItem = useCallback(() => {
    /*const optimisticId = Date.now(); // Temporary unique ID for optimistic update
    const newItem = { id: optimisticId, name: itemName };*/
    const newItem = { id: uuidv4(), name: itemName };
    setRows(currentRows => [...currentRows, newItem]);
    
    const message = JSON.stringify({ command: 'add', params: { name: itemName } });
    console.log("Sending message:", message); // Log the message being sent
    sendMessage(message)
    setItemName(''); // Clear the input field after sending
  }, [itemName, sendMessage]);

  // Function to handle input change
  const handleItemNameChange = (event) => {
    setItemName(event.target.value);
  };

  // Component render
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Real-Time Data Grids</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>Manage Items</Typography>
        <div style={{ margin: '20px 0' }}>
          <TextField 
            label="Item Name" 
            variant="outlined" 
            style={{ marginRight: '10px' }} 
            value={itemName} 
            onChange={handleItemNameChange} 
          />
          <Button variant="contained" color="primary" onClick={handleAddItem}>
            Add Item
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* First Data Grid */}
          <DataGridComponent rows={rows} title="Grid 1" />
          {/* Second Data Grid */}
          <DataGridComponent rows={rows} title="Grid 2" />
        </div>
      </Container>
    </div>
  );
}


export default App;