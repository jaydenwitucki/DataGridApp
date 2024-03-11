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
  /*const socketUrl = 'ws://localhost:5000/ws';

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

  

  const { sendMessage } = useWebSocket(socketUrl, options);*/
  /*const { sendMessage } = useWebSocket('ws://localhost:5173/', {
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      // Update rows based on the message type
      if (message.type === 'update' || message.type === 'delete') {
        setRows(message.data);
      }
    },
    shouldReconnect: (closeEvent) => true,
  }); */
  const { sendMessage } = useWebSocket('ws://localhost:5173/', {
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'add':
          setRows((currentRows) => [...currentRows, message.data]);
          break;
        case 'update':
          setRows((currentRows) =>
            currentRows.map((row) => (row.id === message.data.id ? message.data : row))
          );
          break;
        case 'delete':
          setRows((currentRows) => currentRows.filter((row) => row.id !== message.data.id));
          break;
        default:
          console.log("Unhandled message type:", message.type);
      }
    },
    shouldReconnect: (closeEvent) => true,
  });


  useEffect(() => {
    // Function to fetch items from the backend
    const fetchItems = async () => {
      const response = await fetch('http://localhost:5000/items'); // Adjust with your backend endpoint
      const data = await response.json();
      setRows(data.items);
    };

    fetchItems();
  }, []);

  // Function to add an item
  const addItem = async (itemName) => {
    // Use Fetch or Axios to send a POST request to your backend
    const newItem = { id: uuidv4(), name: itemName };
    setRows(currentRows => [...currentRows, newItem]);
    const response = await fetch('http://localhost:5000/items', { // Adjust with your backend endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: itemName }),
    });

    if (response.ok) {
      // If using WebSockets, the WebSocket listener should update the state
      // Otherwise, fetch items again or update the state directly if response includes the new item
      fetchItems();
    }
  };
  // Function to handle adding items
  /*const handleAddItem = useCallback(() => {
    /*const optimisticId = Date.now(); // Temporary unique ID for optimistic update
    const newItem = { id: optimisticId, name: itemName };
    const newItem = { id: uuidv4(), name: itemName };
    setRows(currentRows => [...currentRows, newItem]);
    
    const message = JSON.stringify({ command: 'add', params: { name: itemName } });
    console.log("Sending message:", message); // Log the message being sent
    sendMessage(message)
    localStorage.setItem('items', JSON.stringify(rows)); 
    
  }, [itemName, sendMessage]); */

  // Function to handle input change
  const handleItemNameChange = (event) => {
    setItemName(event.target.value);
  };

  const handleDeleteItem = (itemId) => {
    const deleteMessage = JSON.stringify({ command: 'delete', params: { id: itemId } });
    console.log("Sending delete message:", deleteMessage); // Confirm message format
    sendMessage(deleteMessage);
};

  // Component render
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Real-Time Data Grids</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <Typography variant="h4" gutterBottom>Grid 1</Typography>
          <DataGridComponent rows={rows} onDelete={handleDeleteItem} />
        </div>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <Typography variant="h4" gutterBottom>Grid 2</Typography>
          <DataGridComponent rows={rows} onDelete={handleDeleteItem} />
        </div>
        <div style={{ marginTop: '20px', clear: 'both', width: '100%' }}>
          <TextField 
            label="Item Name" 
            variant="outlined" 
            style={{ marginRight: '10px' }} 
            value={itemName} 
            onChange={handleItemNameChange} 
          />
          <Button variant="contained" color="primary" onClick={addItem}>
            Add Item
          </Button>
        </div>
      </Container>
    </div>
  );
}


export default App;