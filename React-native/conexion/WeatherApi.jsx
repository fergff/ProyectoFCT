import React, { useState, useEffect } from 'react';

const WeatherApi = ({ url, children }) => {
    const [weatherData, setWeatherData] = useState(null);// Estado para almacenar los datos del clima, inicializado como null
    const [loading, setLoading] = useState(true);// Estado para manejar la carga de datos, inicializado como true
    const [error, setError] = useState(null); // Estado para manejar errores, inicializado como null

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);// Establece el estado de carga a true 
            try {
                const response = await fetch(url);// Realiza la solicitud a la URL proporcionada
                const data = await response.json(); // Convierte la respuesta a formato JSON
                setWeatherData(data);// Establece los datos del clima con los datos recibidos
                setLoading(false); // Establece el estado de carga a false
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return children({ loading, weatherData, error });  // Retorna los datos del tiempo
};

export default WeatherApi;// Exporta el componente WeatherApi para que pueda ser usado en otros archivos
