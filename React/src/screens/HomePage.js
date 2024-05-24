import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase } from 'firebase/database';

function HomeScreen() {
  const [devices, setDevices] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          const devicesRef = ref(getDatabase(), `usuarios/${storedUserId}/devices`);
          onValue(devicesRef, (snapshot) => {
            const devicesData = snapshot.val();
            const devicesList = devicesData ? Object.keys(devicesData).map(key => ({
              id: key,
              ...devicesData[key]
            })) : [];
            setDevices(devicesList);
          });
        }
      } catch (error) {
        console.log("Error retrieving userId", error);
      }
    };

    fetchUserId();
  }, []);


  return (
    <div>
      <div className='bg-green d-flex p-1 justify-content-between align-items-center shadow'>
        <img src={require('../assets/Icons/icon.png')} width={70}  height={70} />
        <div className='me-3'>
          <h3 className='text-light'>Cuenta</h3>
        </div>
      </div>
      <div className='container mt-2'>
      <div className=' d-flex px-1 justify-content-between align-items-end'>
        <h1 className='text-green fw-bold fst-italic'>Dispositivos</h1>
        <p className='fs-4 fst-italic text-secondary'>Usuario: {userId}</p> 
      </div>

      <hr className='text-green' />
      <div className='row align-items-stretch'>
        {devices.map((item) => (

          <div className='col-6 col-md-4 col-lg-3'>
              <div className='card h-100 w-100 bg-green shadow' key={item.id} >
              <div className='d-flex justify-content-between align-items-center rounded  p-3 '>
                <img
                  src={require('../assets/Icons/PottedPlant.png')}
                  width={100}
                  height={100}
                />
                <div className='text-light fs-5 '>{item.id}</div>
              </div>
            </div>
          </div>
          
        ))}
      </div>
    </div>
    </div>
    
  );
}

export default HomeScreen;

