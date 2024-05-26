import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import WeatherApi from '../conexion/WeatherApi';
import { Picker } from '@react-native-picker/picker';
import cities from '../data/citis.json'; //lista de ciudades k pilla el piker
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TiempoScreen({}) {
    const [selectedCityId, setSelectedCityId] = useState(cities[39].lid);  // Utiliza Toledo como inicial

    useEffect(() => {// useEffect que se ejecuta una vez al montar el componente
        // Función para cargar la ciudad seleccionada desde AsyncStorage
        const loadSelectedCity = async () => {
            try {
                const storedCityId = await AsyncStorage.getItem('selectedCityId');
                if (storedCityId !== null) {
                    setSelectedCityId(storedCityId);// Si existe un id guardado, actualiza el estado con ese id
                }
            } catch (error) {
                console.error('Error loading selected city:', error);
            }
        };

        loadSelectedCity();
    }, []);

    useEffect(() => {
        //se ejecuta cada vez que cambia selectedCityId para guardar el nuevo valor en AsyncStorage
        const saveSelectedCity = async () => {
            try {
                await AsyncStorage.setItem('selectedCityId', selectedCityId);
            } catch (error) {
                console.error('Error saving selected city:', error);
            }
        };

        saveSelectedCity();
    }, [selectedCityId]);
       // URL de la API de clima
    const apiURL = `https://api.tutiempo.net/json/?lan=es&apid=qwYqazqqaXzhOaa&lid=${selectedCityId}`;

    // Función para cambiar el formato de la fecha
    const formatDate = (dateString) => {
        const parts = dateString.split('-'); // Divide la cadena "2024-5-2" en ["2024", "5", "2"]
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // Reordena a "DD/MM/YYYY"
    };

    //WeatherApi que maneja la llamada a la API
    return (
        <WeatherApi url={apiURL}>
            {({ loading, weatherData, error }) => {
                if (loading) return <View style={styles.container}><Text>Cargando...</Text></View>;
                if (error) return <View style={styles.container}><Text>Error: {error.message}</Text></View>;

                if (weatherData) {
                    return (
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Text style={styles.tittle}>Tiempo :</Text>
                                <Picker
                                    style={{ height: 10, width: '65%' }}
                                    selectedValue={selectedCityId}
                                    onValueChange={(itemValue, itemIndex) => setSelectedCityId(itemValue)}
                                >
                                    {cities.map((city) => (
                                        <Picker.Item key={city.lid} label={city.nombre} value={city.lid} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={styles.dayContainerHoy}>
                                <Text style={styles.date}>Hoy</Text>

                                <View style={styles.centrar}>
                                    <Image
                                        style={styles.weatherIconHoy}
                                        source={{ uri: `https://v5i.tutiempo.net/wi/05/60/${weatherData.day1.icon}.png` }}
                                    />
                                    <Text style={styles.bold}>Max: {weatherData.day1.temperature_max}ºC</Text>
                                    <Text style={styles.bold}>Min: {weatherData.day1.temperature_min}ºC</Text>
                                    <Text style={styles.bold}>Humedad: {weatherData.day1.humidity}%</Text>
                                </View>
                            </View>
                            <ScrollView style={styles.scrollContainer}>
                                {[weatherData.day2, weatherData.day3, weatherData.day4, weatherData.day5, weatherData.day6, weatherData.day7].map((day, index) => (
                                    <View key={index} style={styles.dayContainer}>
                                        <View>
                                            <Text style={styles.date}>{formatDate(day.date)}</Text>
                                        </View>
                                        <Image
                                            style={styles.weatherIcon}
                                            source={{ uri: `https://v5i.tutiempo.net/wi/05/60/${day.icon}.png` }}
                                        />
                                        <View>
                                            <Text>Max: {day.temperature_max}ºC</Text>
                                            <Text>Min: {day.temperature_min}ºC</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    );
                }

                return null; // Si no hay datos de clima, no se muestra nada
            }}
        </WeatherApi>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tittle: {
        color: '#68A74D',
        fontSize: 30,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    dayContainer: {
        marginBottom: 10,
        padding: 10,
        paddingTop: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    centrar: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    dayContainerHoy: {
        marginBottom: 10,
        padding: 15,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#68A74D',
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bold: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    weatherIcon: {
        width: 50,
        height: 50,
    },
    weatherIconHoy: {
        width: 70,
        height: 70,
    },
});
