import React from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Image, TextInput, ActivityIndicator,TouchableHighlight,
  Dimensions, KeyboardAvoidingView 
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import { resetVerificaCodigoAction } from '../redux/ActionCreators';
import CountDown from 'react-native-countdown-component';

const {width: WIDTH} = Dimensions.get('window');

class CambioPassword extends React.Component {
    state = {
      uploading: false,
      resultadoSubida: false,
      showPass: true,
      press: false,
      password1: '',
      password2: ''
    }

  static navigationOptions = {
    title: 'Cambio de Password - CHML Mobile', 
  };

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  render() {
    //console.log(this.props)
    if (this.state.resultadoSubida){//Si el usuario ya ha sido registrado, muestro sus datos.
      alert('El cambio de clave ha sido correcto. Será dirigido a la pantalla de inicio de sesión.');
      return (
        <View style = {styles.container}>
        
        <Text style={styles.portadaText}>El cambio de password ha sido correcto.</Text>
        <Text style={styles.portadaText}>Será redirigido a la pantalla de inicio de sesión...</Text>
        
        <CountDown
          size={30}
          until={5}
          onFinish={() => this.props.navigation.navigate('Login')}
          onPress={() => this.props.navigation.navigate('Login')}
          digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
          digitTxtStyle={{color: '#1CC625'}}
          timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
          separatorStyle={{color: '#1CC625'}}
          timeToShow={['S']}
          timeLabels={{s: null}}
        />

        </View>
      )
    }

    if (this.state.uploading) {
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>

          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/avatar.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            GUARDANDO LOS CAMBIOS, ESPERE POR FAVOR ...
          </Text>
          <ActivityIndicator color="#0000ff" size="large" />
        
        </View>
      );
    }

    return (
      <View style = {styles.container}>
        <ScrollView>
      
      <Text style={styles.portadaText}>CAMBIO DE PASSWORD - CHML MOBILE</Text>
      
      <Image style={styles.portadaImage}
        source = {require('../assets/logo_chml_web.png')}
        resizeMethod={'resize'}
        resizeMode={'contain'} 
        //imageStyle = {{resizeMode: 'center'}}
      />

      <View style={styles.container}>
          
          <KeyboardAvoidingView keyboardVerticalOffset = {120} behavior="padding">

            <View style={styles.inputContainer}>
              <Ionicons name={'ios-mail'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                style={styles.inputIcon} />

              <Text style={styles.input}>
                Mail: {this.props.mail}
              </Text>

            </View>

            <View style={styles.inputContainer}>
              <Ionicons name={'ios-lock'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                style={styles.inputIcon} />

              <TextInput
                onChangeText={(password1) => this.setState({password1})}
                style = {styles.input}
                placeholder = {'Password1'}
                ref='password1'
                returnKeyType='next'
                secureTextEntry = {this.state.showPass} 
                placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid = 'transparent'
                value={this.state.password1}
              />
            
              <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
                <Ionicons name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} 
                  size={28} color={'rgba(255, 255, 255, 0.7)'}/>
              </TouchableOpacity>        
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name={'ios-lock'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                style={styles.inputIcon} />

              <TextInput
                onChangeText={(password2) => this.setState({password2})}
                style = {styles.input}
                placeholder = {'Password2'}
                ref='password2'
                returnKeyType='next'
                secureTextEntry = {this.state.showPass} 
                placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid = 'transparent'
                value={this.state.password2}
              />
            
              <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
                <Ionicons name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} 
                  size={28} color={'rgba(255, 255, 255, 0.7)'}/>
              </TouchableOpacity>        
            </View>

            </KeyboardAvoidingView>
            
            <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.cambiarPassword()}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/olvido_pass.png')}
              />
              <Text style={styles.buttonText}> 
                Cambiar Password
              </Text>
            </View>
            </TouchableHighlight>

          </View>
      
        </ScrollView>
      </View>
    );
  }

  //Usar la siguiente función en el manejo del botón Cambiar Password.
  cambiarPassword = async () => {
    //En primer lugar, reviso que se hayan completado todos los datos.
    if (!this.validarDatos){
      alert('Revise que las claves sean iguales, de más de 3 caracteres, e intente nuevamente.')
      return false
    }

    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.changePasswordAsync();
      uploadResult = uploadResponse.json();
      if (uploadResult && uploadResult === 1){
        this.setState({
          resultadoSubida: true,
        })
        this.props.resetVerificaCodigoFN()
      }else{
        alert('Error, intente nuevamente. Asegúrese de estar conectado a internet.')
      }
    } catch (e) {
      alert('Error. Asegúrese de estar conectado a internet y de que todos los datos estén cargados.');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };

  async changePasswordAsync() {
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/apiusuarios/v3/cambio_password/cambia_pass.php';

    let formData = new FormData();
    formData.append('mail', this.props.mail)
    formData.append('password', this.state.contrasena1)
    
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    return fetch(apiUrl, options);
  }

  validarDatos = () => {
    let expresionRegularMail = /^.+@.+\.[a-zA-Z]+$/;
    let clavesIguales = (this.state.password1 == this.state.password2);
    return (clavesIguales && expresionRegularMail.exec(this.state.mail) && this.state.password1.length > 3)
  }
}

//El state que se pasa como parámetro hace referencia al de redux, no al de este componente.
const mapStateToProps = state => {
  return {
    mail: state.verificarMail.mailOlvidoPass,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetVerificaCodigoFN: () => dispatch(resetVerificaCodigoAction()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CambioPassword);

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
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,255,0.3)',
    justifyContent: 'center',
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