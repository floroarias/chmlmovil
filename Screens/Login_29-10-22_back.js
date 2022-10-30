//BACKUP: EN ESTA OPCIÓN SE CONSIDERÓ USAR REDUX, EN LA OTRA UNA SOLA PANTALLA CON FUNCIONES COMUNES.
//
//Esta página de login es para que un usuario registrado en la BD pueda iniciar sesión.
//También tiene un enlace para que el usuario no registrado pueda completar sus datos y registrarse,
//y para que el usuario registrado que haya olvidado su contraseña, pueda recuperarla desde su correo.
import React from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Alert, Image, TextInput, TouchableHighlight,
  Dimensions, KeyboardAvoidingView 
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import { usuarioLogInAction } from '../redux/ActionCreators';
import { usuarioLogOutAction } from '../redux/ActionCreators';
import { verificarExisteMailAction } from '../redux/ActionCreators';

const {width: WIDTH} = Dimensions.get('window');

class Login extends React.Component {
    state = {
      showPass: true,
      press: false,
      mail: '',
      password: ''
    }

  static navigationOptions = {
    title: 'Login - CHML Mobile', 
  };

  alertaDeConfirmacion = () => {
    let resultado = false
    Alert.alert(
      "Logout",
      "Está seguro de que desea salir del registro?",
      [
        {
          text: "Cancelar",
          onPress: () => {resultado = false},
          style: "cancel"
        },
        { text: "Confirmar", onPress: () => this.props.logoutFN() }
      ],
      { cancelable: false }
    )
    //console.log(resultado)
    return resultado
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  render() {
    //console.log(this.props)
    if (!this.props.usuarioRegistrado && this.props.respuestaServerMailExiste == 1){
      this.props.navigation.navigate('OlvidoPassword')
    }

    let botonAdministrador
    if (this.props.usuarioRegistrado && this.props.usuario.perfilUsuario == 2){
      botonAdministrador = (
        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Administracion')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/usuario_admin.png')}
          />
          <Text style={styles.buttonText}> 
            Menú de Administración
          </Text>
        </View>
        </TouchableHighlight>
      )
    }

    let pantalla
    if (this.props.usuarioRegistrado){
      
      let leyendaAdmin
      if (this.props.usuario.perfilUsuario == 2){
        leyendaAdmin = 'USTED ES UN USUARIO ADMINISTRADOR'
      }
      
      pantalla = 
        //Vista completa de la pantalla de Logout para el usuario ya registrado.
        <View style={styles.container}>
        
          <Text style={styles.portadaText}>USTED ES UN USUARIO REGISTRADO:</Text>
          <Text style={styles.portadaData}>{this.props.usuario.nombres + ' ' + this.props.usuario.apellidos}</Text>
          <Text style={styles.portadaData}>{'Mail: ' + this.props.usuario.mail}</Text>
          <Text style={styles.portadaText}>{leyendaAdmin}</Text>
          
          {botonAdministrador}

          <View>
          <TouchableHighlight style={[styles.button, styles.facebook]} onPress={()=> this.props.navigation.navigate('Home')}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/home.png')}
              />
              <Text style={styles.buttonText}> 
                Volver al Inicio
              </Text>
            </View>
          </TouchableHighlight>
          
          <TouchableHighlight style={[styles.button, styles.facebook]} onPress={(this.logout.bind(this))}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/logout.png')}
              />
              <Text style={styles.buttonText}> 
                Cerrar Sesión
              </Text>
            </View>
          </TouchableHighlight>
          </View>
        
        </View>
    } else{
      pantalla =
        //Vista completa de la pantalla de Login para el usuario no registrado.
        //También contiene enlace hacia pantalla de registro.
        <View style={styles.container}>
          
          <KeyboardAvoidingView keyboardVerticalOffset = {120} behavior="padding">

            <View style={styles.inputContainer}>
              <Ionicons name={'ios-mail'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                style={styles.inputIcon} />

              <TextInput
                onChangeText={(mail) => this.setState({mail})}
                style = {styles.input}
                placeholder = {'Mail'} 
                ref='mail'
                returnKeyType='next'
                placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid = 'transparent'
                value={this.state.mail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name={'lock-closed-outline'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                style={styles.inputIcon} />

              <TextInput
                onChangeText={(password) => this.setState({password})}
                style = {styles.input}
                placeholder = {'Password'}
                ref='password'
                returnKeyType='next'
                secureTextEntry = {this.state.showPass} 
                placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid = 'transparent'
                value={this.state.password}
              />
            
              <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
                <Ionicons name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} 
                  size={28} color={'rgba(255, 255, 255, 0.7)'}/>
              </TouchableOpacity>        
            </View>

            </KeyboardAvoidingView>
            
            <TouchableHighlight style={[styles.button, styles.facebook]} onPress={(this.login.bind(this))}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/logueado.png')}
              />
              <Text style={styles.buttonText}> 
                Iniciar Sesión
              </Text>
            </View>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Registrarse')}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/chml_azul.png')}
              />
              <Text style={styles.buttonText}> 
                Registrarse en CHML
              </Text>
            </View>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.button, styles.facebook]} onPress={(this.verificarMailExisteEnServer.bind(this))}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/olvido_pass.png')}
              />
              <Text style={styles.buttonText}> 
                Olvidé mi Contraseña
              </Text>
            </View>
            </TouchableHighlight>

          </View>
    }

    return (
      <View style = {styles.container}>
        <ScrollView>
      
      <Text style={styles.portadaText}>INGRESO DE USUARIOS - CHML MOBILE</Text>
      
      <Image style={styles.portadaImage}
        source = {require('../assets/logo_chml_web.png')}
        resizeMethod={'resize'}
        resizeMode={'contain'} 
        //imageStyle = {{resizeMode: 'center'}}
      />

      {pantalla}
      
        </ScrollView>
      </View>
    );
  }

  logout(){
    this.alertaDeConfirmacion()
  };

  login() {
    if (!this.validarDatos()){
      alert('Revise que todos los campos estén completos y sean correctos e intente nuevamente.')
      return false
    }
    this.props.loginFN({mail: this.state.mail, password: this.state.password})
  }

  verificarMailExisteEnServer() {
    if (!this.verificaFormatoMail()){
      alert('Debe ingresar su correo electrónico registrado para realizar esta acción.')
      return false
    }
    this.props.verificaMailFN(this.state.mail)
  }

  validarDatos = () => {
    let expresionRegularMail = /^.+@.+\.[a-zA-Z]+$/;
    return (expresionRegularMail.exec(this.state.mail) && this.state.password.length > 4)
  }

  verificaFormatoMail = () => {
    let expresionRegularMail = /^.+@.+\.[a-zA-Z]+$/;
    return (expresionRegularMail.exec(this.state.mail))
  }
}

//El state que se pasa como parámetro hace referencia al de redux, no al de este componente.
const mapStateToProps = state => {
  return {
    usuarioRegistrado: state.usuarioLogInOut.usuarioRegistrado,
    usuario: state.usuarioLogInOut.usuario,
    mailOlvidoPassword: state.verificarMail.mailOlvidoPass,
    respuestaServerMailExiste: state.verificarMail.respuestaServerMailExiste
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logoutFN: () => dispatch(usuarioLogOutAction()),
    loginFN: (usuario) => dispatch(usuarioLogInAction(usuario)),
    verificaMailFN: (mail) => dispatch(verificarExisteMailAction(mail))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

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