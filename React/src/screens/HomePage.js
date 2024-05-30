import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, getDatabase, update, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function HomeScreen() {
  const [devices, setDevices] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ledState, setLedState] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const modalContentRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        const database = getDatabase();
        const userRef = ref(database, `usuarios/${storedUserId}`);
        const devicesRef = ref(database, `usuarios/${storedUserId}/devices`);

        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUserName(userData ? userData.name : ''); 
        });

        onValue(devicesRef, (snapshot) => {
          const devicesData = snapshot.val();
          const devicesList = devicesData ? Object.keys(devicesData).map(key => ({
            id: key,
            ...devicesData[key]
          })) : [];
          
          // Filtra los dispositivos con connected: true
          const connectedDevices = devicesList.filter(device => device.connected);
          setDevices(connectedDevices);
        });
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenModal = (device) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleBackdropClick = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      handleCloseModal();
    }
  };

  const toggleLed = async () => {
    const newLedState = !ledState;
    setLedState(newLedState);
    const deviceRef = ref(getDatabase(), `usuarios/${userId}/devices/${selectedDevice.id}`);
    update(deviceRef, { SensorLed: newLedState });
  };

  useEffect(() => {
    if (selectedDevice) {
      const ledRef = ref(getDatabase(), `usuarios/${userId}/devices/${selectedDevice.id}/SensorLed`);
      onValue(ledRef, (snapshot) => {
        setLedState(snapshot.val() || false);
      });
    }
  }, [selectedDevice, userId]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
    setDropdownVisible(false);
  };

  const handleCloseChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleBackdropClickChangePassword = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      handleCloseChangePasswordModal();
    }
  };

  const handleSaveNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword === '' || confirmPassword === '') {
      setPasswordError('Las contraseñas no pueden estar vacías');
      return;
    }

    const userRef = ref(getDatabase(), `usuarios/${userId}`);
    await update(userRef, { pass: newPassword });
    setChangePasswordModalVisible(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const initializeDevicesToFalse = async () => {
    if (userId) {
      try {
        const database = getDatabase();
        const devicesRef = ref(database, `usuarios/${userId}/devices`);
        const snapshot = await get(devicesRef);
        const devicesData = snapshot.val();
        const devicesList = devicesData ? Object.keys(devicesData).map(key => ({
          id: key,
          ...devicesData[key]
        })) : [];

        for (const device of devicesList) {
          const deviceRef = ref(database, `usuarios/${userId}/devices/${device.id}`);
          await update(deviceRef, { connected: false })
            .catch((error) => console.log("Error updating device:", error));
        }

        const updatedDevicesList = devicesList.filter(device => device.connected);
        setDevices(updatedDevicesList);
      } catch (error) {
        console.log("Error initializing devices:", error);
      }
    }
  };

  return (
    <div>
      <div className='bg-green d-flex p-1 justify-content-between align-items-center shadow'>
        <img src={require('../assets/Icons/icon.png')} width={70} height={70} alt="logo_icon" />
        <div className='me-4 position-relative' ref={dropdownRef}>
          <h3 className='text-light' onClick={toggleDropdown} style={{ cursor: 'pointer' }}>{userName} <i className="bi bi-caret-down"></i></h3>
          {dropdownVisible && (
            <div className='dropdown-menu show' style={{ position: 'absolute', right: 0 }}>
              <button className='dropdown-item border-0 btn btn-outline-success text-success fs-5' onClick={handleChangePassword}>Cambiar Contraseña <i className="bi bi-unlock"></i></button>
              <button className='dropdown-item border-0 btn btn-outline-success text-success fs-5' onClick={handleLogout}>Cerrar sesión <i className="bi bi-box-arrow-in-right"></i></button>
            </div>
          )}
        </div>
      </div>
      <div className='container mt-2'>
        <div className='d-flex px-1 justify-content-between align-items-end'>
          <h1 className='text-green fw-bold fst-italic'>Dispositivos</h1>
          <p className='fs-4 fst-italic text-secondary'>Usuario: {userId}</p>
        </div>
       
        <hr className='text-green bg-success'/>
        <div className='d-flex justify-content-end'>
          <button className="btn btn-success bg-green mb-3" onClick={initializeDevicesToFalse}>
            <img src={require('../assets/Icons/Synchronize.png')} width={20} height={20} alt="sync" />
          </button>
        </div>
        

        <div className='row align-items-stretch'>
          {devices.map((device) => (
            <div key={device.id} className='col-6 col-md-4 col-lg-3 mb-3' onClick={() => handleOpenModal(device)}>
              <div className='card h-100 w-100 bg-green shadow card-hoverable '>
                <div className='d-flex justify-content-between align-items-center rounded p-3'>
                  <img src={require('../assets/Icons/PottedPlant.png')} width={100} height={100} alt="logo_pot" />
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
                <img src={require('../assets/Icons/PottedPlant.png')} width={50} height={50} alt="logo_pot" />
                <h3 className="modal-title text-light fw-bold fst-italic ms-2">{selectedDevice.id}</h3>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p><span className='fs4 fw-bold fst-italic text-green'>Humedad Aire :</span>  {selectedDevice.SensorHum || "0"}%</p>
                <p><span className='fs4 fw-bold fst-italic text-green'>Humedad Suelo :</span>  {selectedDevice.SensorHumSuelo || "0"}%</p>
                <p><span className='fs4 fw-bold fst-italic text-green'> Temperatura :</span>  {selectedDevice.Sensortemp || "N/A"}°C</p>
                <p><span className='fs4 fw-bold fst-italic text-green'> Riego :</span> {ledState ? 'Encendido' : 'Apagado'}</p>
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

      {changePasswordModalVisible && (
        <div className={`modal ${changePasswordModalVisible ? 'show' : ''}`} style={{ display: changePasswordModalVisible ? 'block' : 'none' }} tabIndex="-1" onClick={handleBackdropClickChangePassword}>
          <div className="modal-dialog modal-dialog-centered" ref={modalContentRef} onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-green">
                <h3 className="modal-title text-light fw-bold fst-italic ms-2">Cambiar Contraseña</h3>
                <button type="button" className="btn-close" onClick={handleCloseChangePasswordModal}></button>
              </div>
              <div className="modal-body">
                <input 
                  type="password" 
                  className="form-control mb-3" 
                  placeholder="Nueva Contraseña" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
                <input 
                  type="password" 
                  className="form-control mb-3" 
                  placeholder="Confirmar Contraseña" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                {passwordError && <div className="text-danger">{passwordError}</div>}
              </div>
              <div className="my-3 d-flex justify-content-center">
                <button className="btn btn-success bg-green" onClick={handleSaveNewPassword}>
                  Guardar Contraseña
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