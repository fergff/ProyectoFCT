import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, getDatabase, update  } from 'firebase/database';

function HomeScreen() {
  const [devices, setDevices] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ledState, setLedState] = useState(false); // Asume un valor booleano por defecto
  const modalContentRef = useRef(null);  // Referencia para el contenido de la modal

  useEffect(() => {
    const fetchUserId = async () => {
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
    };

    fetchUserId();
  }, []);

  const handleOpenModal = (device) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Cerrar la modal si el clic fuera del contenido de la modal
  const handleBackdropClick = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      handleCloseModal();
    }
  };

   // Función para cambiar el estado del LED
   const toggleLed = async () => {
    const newLedState = !ledState;
    setLedState(newLedState);  // Actualiza el estado localmente
    const deviceRef = ref(getDatabase(), `usuarios/${userId}/devices/${selectedDevice.id}`);
    update(deviceRef, { SensorLed: newLedState });  // Actualiza el estado en Firebase
  };

  // Cuando se selecciona un dispositivo, busca su estado actual de LED
  useEffect(() => {
    if (selectedDevice) {
      const ledRef = ref(getDatabase(), `usuarios/${userId}/devices/${selectedDevice.id}/SensorLed`);
      onValue(ledRef, (snapshot) => {
        setLedState(snapshot.val() || false);  // Establece el estado inicial del LED basado en Firebase
      });
    }
  }, [selectedDevice, userId]);

  return (
    <div>
      <div className='bg-green d-flex p-1 justify-content-between align-items-center shadow'>
        <img src={require('../assets/Icons/icon.png')} width={70} height={70} alt="logo_icon"/>
        <div className='me-3'>
          <h3 className='text-light'>Cuenta</h3>
        </div>
      </div>
      <div className='container mt-2'>
        <div className='d-flex px-1 justify-content-between align-items-end'>
          <h1 className='text-green fw-bold fst-italic'>Dispositivos</h1>
          <p className='fs-4 fst-italic text-secondary'>Usuario: {userId}</p>
        </div>

        <hr className='text-green' />
        <div className='row align-items-stretch'>
          {devices.map((device) => (
            <div key={device.id} className='col-6 col-md-4 col-lg-3' onClick={() => handleOpenModal(device)}>
              <div className='card h-100 w-100 bg-green shadow card-hoverable'>
                <div className='d-flex justify-content-between align-items-center rounded p-3'>
                  <img
                    src={require('../assets/Icons/PottedPlant.png')} width={100} height={100} alt="logo_pot"/>
                  <div className='text-light fs-5'>{device.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDevice && (
        <div className={`modal ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }} tabIndex="-1" onClick={handleBackdropClick}>
          <div className="modal-dialog modal-dialog-centered" ref={modalContentRef} onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-green">
                <img src={require('../assets/Icons/PottedPlant.png')}  width={50} height={50}  alt="logo_pot"/>
                <h3 className="modal-title text-light fw-bold fst-italic ms-2">{selectedDevice.id}</h3>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p> <span className='fs4 fw-bold fst-italic text-green'>Humedad Aire :</span>  {selectedDevice.SensorHum || "N/A"}%</p>
                <p> <span className='fs4 fw-bold fst-italic text-green'>Humedad Suelo :</span>  {selectedDevice.SensorHumSuelo || "N/A"}%</p>
                <p> <span className='fs4 fw-bold fst-italic text-green'> Temperatura :</span>  {selectedDevice.Sensortemp || "N/A"}°C</p>
                <p> <span className='fs4 fw-bold fst-italic text-green'> Riego :</span> {ledState ? 'Encendido' : 'Apagado'}</p>
              </div>
              <div className='my-3 d-flex justify-content-center'>
              <button className={`btn ${ledState ? 'btn-danger bg-red' : 'btn-success bg-green'}`} onClick={toggleLed}>
                  {ledState ? 'Apagar Riego' : 'Encender Riego'}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}


    </div>
  );
}

export default HomeScreen;
