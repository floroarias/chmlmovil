import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, 
ScrollView, TouchableOpacity,Dimensions } from 'react-native';
//import { Linking } from 'react-native';
//import { SliderBox } from "react-native-image-slider-box";
import BotonLogin from './BotonLogin'
const {width: WIDTH} = Dimensions.get('window');

export class Home extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Inicio - CHML Mobile',
      headerRight: () => (<BotonLogin nav = {navigation} />),
    };
  };

  render() {
    let botonAdministrador
    if (this.props.usuarioRegistrado && this.props.usuario.perfilUsuario == 2){
      botonAdministrador = (
        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Administracion')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/usuario_admin.png')}
          />
          <Text style={styles.buttonText}> 
            Administración
          </Text>
        </View>
        </TouchableHighlight>
      )
    }
    
    return (
      <View style={styles.container}>
        
        <ScrollView>

          <Image style={styles.portadaImage}
            source = {require('../assets/logo_chml_web.png')}
            resizeMethod={'resize'}
            resizeMode={'contain'} 
            //imageStyle = {{resizeMode: 'center'}}
          />
        
        <View style={styles.container}>
          
        <TouchableHighlight style={[styles.button, styles.impuestos]} onPress={() => this.props.navigation.navigate('Identificarse')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/impuestos.png')}
          />
          <Text style={styles.buttonText}>
            Impuestos
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.impuestos]} onPress={() => this.props.navigation.navigate('Denuncias')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/logo_denuncia.png')}
          />
          <Text style={styles.buttonText}>
            Denuncias / Reclamos
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Novedades')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/novedades2.png')}
          />
          <Text style={styles.buttonText}> 
            Novedades CHML
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('DeliveryMain')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/delivery.png')}
          />
          <Text style={styles.buttonText}> 
            Deliverys
          </Text>
        </View>
        </TouchableHighlight>

        {botonAdministrador}
        
        <View style={styles.contenedorHorizontal}>
        <TouchableHighlight style={styles.botonPequeno} onPress={() => this.props.navigation.navigate('Facebook')}>
        <View>
          <Image style={styles.buttonImage}
            source={require('../assets/facebook.png')}
          />
        </View>
        </TouchableHighlight>
        
        <TouchableHighlight style={styles.botonPequeno} onPress={() => this.props.navigation.navigate('Instagram')}>
        <View>
          <Image style={styles.buttonImage}
            source={require('../assets/instagram.png')}
          />
        </View>
        </TouchableHighlight>
        
        <TouchableHighlight style={styles.botonPequeno} onPress={() => this.props.navigation.navigate('Noticias')}>
        <View> 
          <Image style={styles.buttonImage}
            source={require('../assets/web.png')}
          />
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.botonPequeno} onPress={() => this.props.navigation.navigate('MapaCHML')}>
        <View>
          <Image style={styles.buttonImage}
            source={require('../assets/mapa.png')}
          />
        </View>
        </TouchableHighlight>

        </View>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('PoliticaPrivacidad')}>
          <Text style={{color: 'blue'}}>
            Política de Privacidad
          </Text>
        </TouchableOpacity>
        
        </View>

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
    width: WIDTH * 0.90,
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
    //alignSelf: 'center', 
    //width: 268, 
    height: 130,
    //marginBottom: 10,
    //marginTop: 10,
    //borderRadius: 10,
  },
  contenedorHorizontal:{
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH * 0.90, 
    height: 130,
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: -20,
    //borderRadius: 10,
  },
  botonPequeno:{
    justifyContent: "center",
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
    backgroundColor: '#155293',
  },
  portadaImage: {
    width: WIDTH * 0.9, 
    height: 80,
    alignSelf: 'center',
  },
});