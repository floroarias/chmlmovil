//En esta pantalla, el contribuyente debe ingresar su tipo y nro documento.
//Redux guardará estos datos en el global state, y se usará para recuperar la info de las cuentas.
//Este estado no es persistente al cerrar la app.
import React, {useState} from 'react';
//import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import { 
  StyleSheet, Text, View,
  Image, TextInput, TouchableHighlight,
  Dimensions, KeyboardAvoidingView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { contribuyenteLoginActionSync } from '../redux/ActionCreators';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';

const {width: WIDTH} = Dimensions.get('window');

export default function Identificarse () {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);
  
    return (
      <View style = {styles.container}>
        <ScrollView>
          
          <Text style={styles.portadaText}>CONSULTA DE IMPUESTOS - CHML MOBILE</Text>
          
          <Image style={styles.portadaImage}
            source = {require('../assets/logo_chml_web.png')}
            resizeMethod={'resize'}
            resizeMode={'contain'} 
            //imageStyle = {{resizeMode: 'center'}}
          />

          <Text style={styles.portadaText}>A continuación, ingrese su tipo y nro de documento, sin puntos:</Text>
        
        <View style={styles.container}>

        <View style={styles.contenedorHorizontal}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
  
        <KeyboardAvoidingView keyboardVerticalOffset = {120} behavior="padding">

        <View style={styles.inputContainer}>
        <Ionicons name={'ios-finger-print'} size={28} color={'rgba(255, 255, 255, 0.7)'}
          style={styles.inputIcon} />

        <TextInput
          onChangeText={(nroDoc) => this.actualizarNroDocumento(nroDoc)}
          style = {styles.input}
          placeholder = {'Nro de Documento'} 
          ref='nroDoc'
          returnKeyType='next'
          placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
          underlineColorAndroid = 'transparent'
          value={this.state.nroDoc}
        />
        </View>

        </KeyboardAvoidingView>
        </View>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={(this.dniLogin.bind(this))}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/impuestos.png')}
            />
            <Text style={styles.buttonText}> 
                Ver Impuestos
            </Text>
          </View>
        </TouchableHighlight>
        
        </View>
        
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue', //#155293 azul oscuro
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    //width: WIDTH * 0.9,
    height: 40,
    borderRadius: 5,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 25
  },
  inputIcon: {
    position: 'absolute',
    top: 5,
    left: 37
  },
  inputContainer: {
    //marginTop: 20,
    alignSelf: "center",
    width: WIDTH*0.9*0.85,
  },
  btnEye: {
    position: 'absolute',
    top: 5,
    right: 37
  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#432577',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  datosContribuyente: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    fontFamily: 'Roboto',
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'red',
    width: WIDTH * 0.9,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
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
  facebook:{
    backgroundColor: '#155293',
  },
  portadaText: {
    fontFamily: 'Roboto',
    color: '#155293',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 14,
    padding: 10,
  },
  contenedorHorizontal:{
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: "center",
    width: WIDTH * 0.90, 
    //height: 130,
    //justifyContent: "space-between",
    //marginBottom: 10,
    //marginTop: 10,
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
    height: 60,
    alignSelf: 'center',
  },
  portada: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightskyblue',
    justifyContent: 'center',
    width: WIDTH,
  },
  dropdown: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightskyblue',
    justifyContent: 'center',
    width: WIDTH*0.2,
  },
});