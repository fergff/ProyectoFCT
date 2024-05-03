import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import WeatherApi from '../conexion/WeatherApi';


export default function TiempoScreen({}) {
    

    

    const apiURL = 'https://api.tutiempo.net/json/?lan=es&apid=qwYqazqqaXzhOaa&lid=1272';

     // Función para cambiar el formato de la fecha
    const formatDate = (dateString) => {
    const parts = dateString.split('-'); // Divide la cadena "2024-5-2" en ["2024", "5", "2"]
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Reordena a "DD/MM/YYYY"
    };
    return (
      <WeatherApi url={apiURL}>
      {({ loading, weatherData, error }) => {
          if (loading) return <View style={styles.container}><Text>Cargando...</Text></View>;
          if (error) return <View style={styles.container}><Text>Error: {error.message}</Text></View>;

          if (weatherData) {
              return (
                  <View style={styles.container}>
                      <View style={styles.header}>
                          <Text style={styles.headerText}>Tiempo : Toledo</Text>
                          
                      </View>
                      
                      <View style={styles.dayContainerHoy}>  
                          
                          <Text style={styles.date}>Hoy</Text>
                          
                          <View style={styles.centrar}>
                              <Image
                                  style={styles.weatherIconHoy}
                                  source={{ uri: `https://v5i.tutiempo.net/wi/05/60/${weatherData.day1.icon}.png` }}
                              />
                              <Text style= {styles.bold}>Max: {weatherData.day1.temperature_max}ºC</Text>
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

          return null;
      }}
  </WeatherApi>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop:10,
        paddingHorizontal:10,
        marginBottom:10,
    },
    header: {
      flexDirection:'row',
      alignItems:'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dayContainer: {
        marginBottom: 10,
        padding: 10,
        paddingTop:15,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        alignContent:'center',
        justifyContent:'space-between',
    },
    centrar:{
      flexDirection:'column',
      alignItems:'center'
    },
    dayContainerHoy: {
        marginBottom: 10,
        padding: 15,
        borderRadius: 5,
        borderWidth: 2, 
        borderColor: '#000',
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bold:{
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
