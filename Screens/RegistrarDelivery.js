import React from 'react';
import { StyleSheet, Text, View,
TouchableHighlight, Image, Dimensions } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const {width: WIDTH} = Dimensions.get('window');

export class RegistrarDelivery extends React.Component {
  static navigationOptions = {
    title: 'Registrar Delivery - CHML Mobile', 
  };

  state = {
    result: null,
  };

  _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync('https://forms.gle/efh2ouPRoqxBT4Df8');
    this.setState({ result });
  };

  render() {
    return (
      <View style={styles.container}>
      <ScrollView>
        
      <Text style={styles.portadaText}>
        A continuación, podrás registar tu comercio de delivery.{"\n"}
        Se abrirá un formulario donde deberás completar los datos.{"\n"}
        También vas a poder subir el logo de tu empresa.{"\n"}
        {"\n"}El logo no es obligatorio, pero te recomendamos que lo subas.{"\n"}
        {"\n"}La carga en la base de datos puede demorar hasta 24 hs.{"\n"}
        {"\n"}Por dudas o consultas podés mandar un correo electrónico a:{"\n"}  
      </Text>
      
      <Text
        style={styles.portadaText}
        onPress={() => Linking.openURL('mailto:registro@chosmalal.net.ar?subject=Consulta')}>
        registro@chosmalal.net.ar
      </Text>

      <TouchableHighlight style={[styles.button, styles.facebook]} onPress={this._handlePressButtonAsync}>
      <View style={styles.buttoncontent}>
        <Image style={styles.buttonImage}
          source={require('../assets/registrar_delivery.png')}
        />
        <Text style={styles.buttonText}> 
          REGISTRAR MI DELIVERY
        </Text>
      </View>
      </TouchableHighlight>
      
      </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'red',
    width: 350,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    padding: 10,
  },
  buttonImage: {
    width: 40, 
    height: 40,
    alignSelf: 'center',
  },
  buttoncontent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingLeft: 15,
  },
  impuestos:{
    backgroundColor: '#155293',
  },
  facebook:{
    backgroundColor: '#155293',
  },
  twitter:{
    backgroundColor: '#155293',
  },
  instagram:{
    backgroundColor: '#155293',
  },
  noticias:{
    backgroundColor: '#155293',
  },
  logo:{
    alignSelf: 'center', 
    width: 271, 
    height: 90,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  cuerpoText: {
    fontFamily: 'Roboto',
    color: 'black',
    textAlign: 'justify',
    fontSize: 15,
    padding: 10,
  },
  portadaText: {
    fontFamily: 'Roboto',
    color: '#155293',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 14,
    padding: 10,
  },
  buttonHorizontal: {
    //backgroundColor: 'red',
    width: WIDTH*0.3,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
  },
});