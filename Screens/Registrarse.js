import React from "react";
import { 
    StyleSheet, Text, View, TouchableOpacity, 
    Image, TextInput, ScrollView, ActivityIndicator,
    Dimensions, KeyboardAvoidingView, TouchableHighlight
  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width: WIDTH} = Dimensions.get('window');

export default class Registrarse extends React.Component {
    state = {
      showPass: true,
      press: false,
      uploading: false,
      nombres: '',
      apellidos: '',
      mail:'',
      contrasena1: '',
      contrasena2: '',
      resultadoSubida: false,
    }

  static navigationOptions = {
    title: 'Registrarse - CHML Mobile', 
  };

  //Usar la siguiente función en el manejo del botón GuardarUsuario.
  _handleUploadUser = async () => {
    //En primer lugar, reviso que se hayan completado todos los datos.
    if (!this.validarDatos){
      alert('Error. Revise que todos los campos estén completos y sean correctos e intente nuevamente.')
      return false
    }

    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.uploadUserAsync();
      uploadResult = uploadResponse.json();

      if (uploadResult && uploadResult === 5){
        this.setState({
          resultadoSubida: true,
        })
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

  async uploadUserAsync() {
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/apiusuarios/v2/registrar_usuario.php';

    let formData = new FormData();
    formData.append('mail', this.state.mail)
    formData.append('password', this.state.contrasena1)
    formData.append('apellidos', this.state.apellidos)
    formData.append('nombres', this.state.nombres)
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    return await fetch(apiUrl, options);
  }

  validarDatos = () => {
    let expresionRegularNombreApellido = /^[a-zA-Z]{2}[a-zA-Z]*$/;
    let expresionRegularMail = /^.+@.+\.[a-zA-Z]+$/;

    let nombreCorrecto = expresionRegularNombreApellido.exec(this.state.nombres)
    let apellidoCorrecto = expresionRegularNombreApellido.exec(this.state.apellidos)
    let mailCorrecto = expresionRegularMail.exec(this.state.mail)
    let passwordCorrecto = ( this.state.contrasena1.length > 3 && (this.state.contrasena1 == this.state.contrasena2) )
    
    return (nombreCorrecto && apellidoCorrecto && mailCorrecto && passwordCorrecto)
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  guardarUsuario = async () => {
    var formData = new FormData()
    formData.append('mail', this.state.mail)
    formData.append('password', this.state.contrasena1)
    formData.append('apellidos', this.state.apellidos)
    formData.append('nombres', this.state.nombres)
    return await fetch('https://chmlmobile.chosmalal.net.ar/apiusuarios/v2/registrar_usuario.php', {
      method: 'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
    .then((resp) =>
      resp.json()
    )
    .catch((err) =>
      console.log(err)
    )
  }

  render() {
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
            Registrando usuario, espere por favor...
          </Text>
          <ActivityIndicator color="#0000ff" size="large" />
        
        </View>
      );
    }

    if (this.state.resultadoSubida){//Si el usuario ya ha sido registrado, muestro sus datos.
      return (
        <View style = {styles.container}>

        <ScrollView>
        
        <View style = {styles.container}>
        <Text style={styles.portadaText}>
          Usuario Registrado Exitosamente - CHML Mobile{"\n"}
          Revise su correo para realizar la confirmación y poder iniciar sesión.{"\n"}
        </Text>
        
        <Image style={styles.portadaImage}
            source = {require('../assets/logo_chml_web.png')} 
            resizeMethod={'resize'}
            resizeMode={'contain'}
        />
        </View>
        
        <View style = {styles.container}>
        <Text style={styles.portadaText}>
          Datos de Registro:{"\n"}{"\n"}
          Nombre: {this.state.nombres} {this.state.apellidos}{"\n"}
          Mail: {this.state.mail}{"\n"}
        </Text>
        </View>
        
        <View style={styles.container}>
        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Home')}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/home.png')}
            />
            <Text style={styles.buttonText}> 
              Volver al Inicio
            </Text>
          </View>
        </TouchableHighlight>
        </View>

        </ScrollView>

        </View>
      );
    }

    return (
        <View style = {styles.container}>

        <ScrollView>

        <Text style={styles.portadaText}>Registro de Usuarios - CHML Mobile</Text>
        
        <Image style={styles.portadaImage}
        source = {require('../assets/logo_chml_web.png')}
        resizeMethod={'resize'}
        resizeMode={'contain'} 
        //imageStyle = {{resizeMode: 'center'}}
        />

        <KeyboardAvoidingView>

        <View style={styles.inputContainer}>
          <Ionicons name={'ios-person'} size={28} color={'rgba(255, 255, 255, 0.7)'}
            style={styles.inputIcon} />

          <TextInput
            onChangeText={(nombres) => this.setState({nombres})}
            style = {styles.input}
            placeholder = {'Nombres'} 
            ref='nombres'
            returnKeyType='next'
            placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
            underlineColorAndroid = 'transparent'
            value={this.state.nombres}
          />
        </View>

        <View style={styles.inputContainer}> 
          <Ionicons name={'ios-person'} size={28} color={'rgba(255, 255, 255, 0.7)'}
            style={styles.inputIcon} />

          <TextInput
            onChangeText={(apellidos) => this.setState({apellidos})}
            style = {styles.input}
            placeholder = {'Apellidos'} 
            ref='apellidos'
            returnKeyType='next'
            placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
            underlineColorAndroid = 'transparent'
            value={this.state.apellidos}
          />
        </View>
        
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
            onChangeText={(contrasena1) => this.setState({contrasena1})}
            style = {styles.input}
            placeholder = {'Password'}
            ref='contrasena1'
            returnKeyType='next'
            secureTextEntry = {this.state.showPass} 
            placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
            underlineColorAndroid = 'transparent'
            value={this.state.contrasena1}
          />
          
          <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
            <Ionicons name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} 
              size={28} color={'rgba(255, 255, 255, 0.7)'}/>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name={'lock-closed-outline'} size={28} color={'rgba(255, 255, 255, 0.7)'}
            style={styles.inputIcon} />

          <TextInput
            onChangeText={(contrasena2) => this.setState({contrasena2})}
            style = {styles.input}
            placeholder = {'Password Nuevamente'}
            ref='contrasena2'
            returnKeyType='next'
            secureTextEntry = {this.state.showPass} 
            placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
            underlineColorAndroid = 'transparent'
            value={this.state.contrasena2}
          />

          <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
            <Ionicons name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} 
              size={28} color={'rgba(255, 255, 255, 0.7)'}/>
          </TouchableOpacity>
        </View>
        
        </KeyboardAvoidingView>

        <View style={styles.container}>           
          <TouchableHighlight style={[styles.button, styles.facebook, {marginBottom: 10}]} onPress={() => this._handleUploadUser()}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/ok.png')}
              />
              <Text style={styles.buttonText}> 
                Registrarse en CHML
              </Text>
            </View>
          </TouchableHighlight>
        </View>

        </ScrollView>

      </View>
    );
  }

} //Cierre de la clase.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: WIDTH - 55,
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
    marginTop: 10
  },
  btnEye: {
    position: 'absolute',
    top: 5,
    right: 37
  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
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
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,255,0.3)',
    justifyContent: 'center',
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
  buttonFecha: {
    backgroundColor: 'red',
    width: WIDTH * 0.85,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
  },
  buttonTextFecha: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
    padding: 10,
  },
  buttonImageFecha: {
    width: 30, 
    height: 30,
    alignSelf: 'center',
  },
  buttoncontentFecha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingLeft: 15,
  },
  portadaText2: {
    fontFamily: 'Roboto',
    color: '#155293',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
    padding: 5,
    margin: 5
  },
});