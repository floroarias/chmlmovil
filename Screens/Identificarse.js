//En esta pantalla, el contribuyente debe ingresar su tipo y nro documento.
//Redux guardará estos datos en el global state, y se usará para recuperar la info de las cuentas.
//Este estado no es persistente al cerrar la app.
import React from 'react';
//import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import { 
  StyleSheet, Text, View,
  Image, TextInput, TouchableHighlight,
  Dimensions, KeyboardAvoidingView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { contribuyenteLoginActionSync } from '../redux/ActionCreators';
//import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';

const {width: WIDTH} = Dimensions.get('window');

class Identificarse extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      tipoDoc: '',
      nroDoc: '',
      press: false,
      open: false,
      value: {label: 'DNI', value: 'DNI'},
      items: [
        {label: 'DNI', value: 'DNI'},
        {label: 'CUIT', value: 'CUIT'},
        {label: 'CUIL', value: 'CUIL'},
        {label: 'CI', value: 'CI'},
        {label: 'LC', value: 'LC'},
        {label: 'LE', value: 'LE'},
        {label: 'PAS', value: 'PAS'}
      ],
    }

  }

  setValue = (callback) => {
    this.setState({ value: callback() })
    //console.log(this.state.value)
  }

  setOpen = (open) => this.setState({ open })

  setItems = (items) => this.setState({ items })

  componentDidMount(){
    this.setState({
      tipoDoc: this.props.documento ? this.props.documento.tipoDoc : '',
      nroDoc: this.props.documento ? this.props.documento.nroDoc : '',
    })
  }

  static navigationOptions = {
    title: 'Identificar Contribuyente - CHML Mobile', 
  };

  render() {
    const { open, value, items } = this.state;
    
    return (
      <View style = {styles.container}>
          
          <Text style={styles.portadaText}>Consulta de Impuestos - CHML Mobile</Text>
          
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
          open={this.state.open}
          value={this.state.value}
          items={this.state.items}
          setOpen={this.setOpen}
          setValue={this.setValue}
          setItems={this.setItems}
          placeholder = {'Tipo Doc'} 
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.35)"
          }}
          containerStyle={{
            width: WIDTH*0.3,
          }}
          textStyle={{
            fontSize: 15
          }}
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
      </View>
    );
  }

  actualizarNroDocumento = (nroDocumento) => {
    this.setState({
      nroDoc: nroDocumento
    });
  };

  actualizartipoDocumento = (tipoDocumento) => {
    this.setState({
      tipoDoc: tipoDocumento
    });
  };


  dniLogin = () => {
    if (!this.corroborarNroDoc(this.state.value.label, this.state.nroDoc)){
      alert('El número de documento no tiene el formato acorde al tipo de documento (Para CUIL/CUIT utilice el formato ##-########-#, para el resto, utilice 7 u 8 números sin punto).')
      return
    }
    this.props.contribuyenteLogin({tipoDoc: this.state.value.label, nroDoc: this.state.nroDoc});
    this.props.navigation.navigate('Impuestos');
  }

  //Verifica que el nro de doc tenga el formato correcto según el tipo.
  corroborarNroDoc(tipoDoc, nroDoc){
    let expresionReg;

    if (tipoDoc == 'CUIL' || tipoDoc == 'CUIT'){
      expresionReg = /^\d{2}-\d{8}-\d{1}$/;
    }else{
      expresionReg = /^\d{7}$|^\d{8}$/;
    }

    return expresionReg.exec(nroDoc)
  }

} //Cierre de la clase.

//El state que se pasa como parámetro hace referencia al de redux, no al de este componente.
function mapStateToProps (state)  {
  return {
    documento: state.contribuyenteLogin.documento,
    contribuyenteLogueado: state.contribuyenteLogin.contribuyenteLogueado
  }
}

function mapDispatchToProps (dispatch) {
    return{
        contribuyenteLogin: doc => dispatch(contribuyenteLoginActionSync(doc)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Identificarse);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue', //#155293 azul oscuro
    alignItems: 'center',
    //justifyContent: 'center',
  },
  input: {
    width: WIDTH * 0.5,
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
    //alignItems: 'baseline',
    //justifyContent: "center",
    //width: WIDTH * 0.90, 
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