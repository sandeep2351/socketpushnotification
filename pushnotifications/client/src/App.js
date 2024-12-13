import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const userID = "user1"; // Unique identifier for this user
const socket = io.connect("http://localhost:5000", {
  query: { userID }, // Send userID as a query parameter
});

function App() {
  const [notification, setNotification] = useState([]);

  const handleDisconnect = () => {
    socket.disconnect();
    console.log("Disconnected from the server");
  };


  useEffect(() => {
    // Listen for notifications
    socket.on("pushNotification", (data) => {
      console.log(data);
      setNotification((prev) => [...prev, data]); // Update notifications
    });

    // Cleanup the socket listener on unmount
    return () => {
      socket.off("pushNotification");
    };
  }, []);

  return (
    <div>
      <h1>Push Notifications</h1>
      <ul>
        {notification.map((notifi, index) => (
          <li key={index}>{notifi.message}</li>
        ))}
      </ul>
      
  <button onClick={handleDisconnect}>Disconnect</button>
    </div>
  );
}

export default App;
