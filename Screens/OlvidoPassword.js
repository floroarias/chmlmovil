import React from 'react';
import { 
  StyleSheet, Text, View, 
  Image, TextInput, TouchableHighlight,
  Dimensions, KeyboardAvoidingView 
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import { resetearRespuestaServerAction } from '../redux/ActionCreators';
import { verificarCodigoCorrectoAction } from '../redux/ActionCreators';

const {width: WIDTH} = Dimensions.get('window');
const chequeoCodigoUrl = "https://chmlmobile.chosmalal.net.ar/apiusuarios/v3/chequeo_codigo_cambio_pass.php";

class OlvidoPassword extends React.Component {
    state = {
      mail: '',
      codigo: '',
    }

  static navigationOptions = {
    title: 'Olvido de Password - CHML Mobile', 
  };

  render() {
    //console.log(this.props)
    //Reseteo la respuesta del servidor para evitar ciclos y errores si se vuelve a pantalla anterior.
    if (this.props.respuestaServerMailExiste == 1){
      this.props.resetearRespuestaServerFN()
    }

    //Si la respuesta del servidor es correcta, navegamos a la pantalla para elegir nuevo password.
    if (this.props.respuestaServerCodigoCorrecto == 1){
      alert('El código es correcto!! En la siguiente pantalla podrá elegir una nueva contraseña.')
      //navegar proxima pantalla.
      this.props.navigation.navigate('CambioPassword')
    }

    //Si la respuesta del servidor es incorrecta, permanecemos en esta pantalla para reingresar el código.
    if (this.props.respuestaServerCodigoCorrecto == 0){
      alert('El código ingresado no es correcto, revise su correo e intente nuevamente.')
    }

    return (
      <View style = {styles.container}>
        <ScrollView>
      
      <Text style={styles.portadaText}>OLVIDO DE PASSWORD - CHML MOBILE</Text>
      <Text style={styles.portadaText}>Chequeo de Código de Verificación de Mail</Text>
      
      <Image style={styles.portadaImage}
        source = {require('../assets/olvido_pass.png')}
        resizeMethod={'resize'}
        resizeMode={'contain'} 
        //imageStyle = {{resizeMode: 'center'}}
      />

      <View style={styles.container}>
          <Text style={styles.portadaText}>Ingrese el código que fue enviado a su correo:</Text>
          <KeyboardAvoidingView keyboardVerticalOffset = {120} behavior="padding">

            <View style={styles.inputContainer}>
              <Ionicons name={'finger-print'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                style={styles.inputIcon} />

              <TextInput
                onChangeText={(codigo) => this.setState({codigo})}
                style = {styles.input}
                placeholder = {'Codigo'} 
                ref='codigo'
                returnKeyType='next'
                placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid = 'transparent'
                value={this.state.codigo}
              />
            </View>

            </KeyboardAvoidingView>
            
            <TouchableHighlight style={[styles.button, styles.facebook]} onPress={(this.verificarCodigoEnServer.bind(this))}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/olvido_pass.png')}
              />
              <Text style={styles.buttonText}> 
                Chequear Código
              </Text>
            </View>
            </TouchableHighlight>

          </View>
      
        </ScrollView>
      </View>
    );
  }

  verificarCodigoEnServer = () => {
    if (!this.validarDatos()){
      alert('Debe ingresar el código para realizar esta acción.')
      return false
    }
    this.props.verificarCodigoFN(this.props.mailOlvidoPass, this.state.codigo)
  }

  validarDatos = () => {
    return (this.state.codigo.length > 4 && this.state.codigo.length < 9)
  }
}

//El state que se pasa como parámetro hace referencia al de redux, no al de este componente.
const mapStateToProps = state => {
  return {
    mailOlvidoPass: state.verificarMail.mailOlvidoPass,
    respuestaServerMailExiste: state.verificarMail.respuestaServerMailExiste,
    respuestaServerCodigoCorrecto: state.verificarCodigo.resultadoChequeoDeCodigo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetearRespuestaServerFN: () => dispatch(resetearRespuestaServerAction()),
    verificarCodigoFN: (mail, codigo) => dispatch(verificarCodigoCorrectoAction(mail, codigo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OlvidoPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: WIDTH * 0.9,
    height: 40,
    borderRadius: 45,
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
    marginTop: 20
  },
  btnEye: {
    position: 'absolute',
    top: 5,
    right: 37
  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#ab333c',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    backgroundColor: 'red',
    width: WIDTH * 0.9,
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
  portadaImage: {
    width: WIDTH * 0.9, 
    height: 60,
    alignSelf: 'center',
  },
  buttonLogout: {
    //backgroundColor: 'red',
    width: WIDTH * 0.4,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 30,
  },
  buttonLogoutContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 3,
    paddingLeft: 0,
  },
  buttonLogoutText: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
    //padding: 10,
    paddingLeft: 10,
  },
  buttonLogoutImage: {
    width: 20, 
    height: 20,
    alignSelf: 'flex-start',
  },
  portadaData: {
    fontFamily: 'Roboto',
    color: '#155293',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
    padding: 10,
  },
});