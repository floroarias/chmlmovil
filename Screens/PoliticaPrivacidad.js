import React from "react";
import {StyleSheet, Text, View} from 'react-native';

export default class PoliticaPrivacidad extends React.Component {
    static navigationOptions = {
        title: 'Política de Privacidad - CHML Mobile', 
    };

    render () {
        return (
            <View style = {styles.container}>
                <Text style={styles.portadaText}>
                    POLÍTICA DE PRIVACIDAD DE CHML MOBILE:{"\n"}{"\n"}
                    El objetivo de esta Política de Privacidad es informarte sobre qué datos recogemos, por qué los recogemos y cómo puedes actualizarlos, gestionarlos, exportarlos y eliminarlos.
                    {"\n"}
                    Si no has iniciado sesión en la app, sólo se almacena información con fines estadísticos, respecto de las consultas que realizas:
                    {"\n"}Datos de los servicios sobre los cuales realizas consultas, o si has abierto la pantalla de delivery. Todo ello sin registrar datos de tu dispositivo.
                    {"\n"}
                    Si has iniciado sesión, recogemos un poco más de información que almacenamos con fines estadísticos y de seguridad:
                    {"\n"}Las imágenes que subas como denuncias tendrán información de la ubicación desde la cual estás enviando.
                    {"\n"}Las denuncias que subas, públicas o privadas, están asociadas con tu usuario.
                    {"\n"}{"\n"}
                    La Municipalidad de Chos Malal nuncá compartirá la información privada de uso de la app con ninguna otra organización, institución o empresa.
                    {"\n"}{"\n"}
                    Al utilizar la aplicación, estás de acuerdo con estas políticas de provacidad.
                </Text>
            </View>
        )
    }

} //Cierre de la clase.

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'lightskyblue',
      alignItems: 'center',
      justifyContent: 'center',
    },
    portadaText: {
      fontFamily: 'Roboto',
      color: '#155293',
      fontWeight: 'bold',
      alignSelf: 'center',
      fontSize: 10,
      padding: 10,
    },
});