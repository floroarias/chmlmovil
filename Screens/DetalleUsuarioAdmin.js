//Esta pantalla se usa para editar o eliminar un usuario existente, o agregar un usuario nuevo.
//Solo usuarios de tipo Admin.
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TextInput, TouchableOpacity,
  Image, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width: WIDTH} = Dimensions.get('window');
import Checkbox from 'expo-checkbox';

class DetalleUsuarioAdmin extends React.Component {
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
    usuarioAdmin: false,
  } 

  static navigationOptions = {
    title: 'Detalle de Usuario - CHML Mobile', 
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

    return fetch(apiUrl, options);
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
    return (
      <View style = {styles.container}>

          <Text style={styles.portadaText}>Registro de Usuarios - CHML Mobile</Text>
          <Text style={styles.portadaText}>Usuario Administrador</Text>
          
          <Image style={styles.portadaImage}
          source = {require('../assets/usuario_admin.png')}
          resizeMethod={'resize'}
          resizeMode={'contain'} 
          //imageStyle = {{resizeMode: 'center'}}
          />
        
        <KeyboardAvoidingView behavior="height">
          
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
                ref='password'
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
                ref='password'
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

        <View style={styles.contenedorHorizontal}>
        
          <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={() => this.props.navigation.navigate('AdministracionUsuarios')}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/cancel.png')}
              />
              <Text style={styles.buttonTextPequeño2}> 
                Cancelar
              </Text>
            </View>
          </TouchableHighlight>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Administrador</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: 5}}
              value={this.state.usuarioAdmin}
              onValueChange={(valor) => this.setState({usuarioAdmin: valor})}
            />
          </View>

          <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={() => this._handleUploadUser()}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/ok.png')}
              />
              <Text style={styles.buttonTextPequeño2}> 
                Guardar
              </Text>
            </View>
          </TouchableHighlight>
        
        </View>
        </View>
    );
  }
}

function mapStateToProps (state)  {
  return {
    usuarioRegistrado: state.usuarioLogInOut.usuarioRegistrado,
    usuario: state.usuarioLogInOut.usuario
  }
}

export default connect(mapStateToProps)(DetalleUsuarioAdmin);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'lightskyblue',
      //alignItems: 'center',
      //justifyContent: 'center',
      //margin: 10,
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
      margin: 10,
      alignSelf: 'center',
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
    buttonHorizontal: {
      //backgroundColor: 'red',
      width: WIDTH * 0.28,
      height: 60,
      borderRadius: 5,
      borderWidth: 1,
      margin: 10,
      alignItems: 'flex-start',
    },
    buttonText: {
      fontFamily: 'Roboto',
      color: 'white',
      //alignSelf: 'center',
      fontSize: 20,
      //padding: 10,
    },
    buttonImage: {
      width: 40, 
      height: 40,
      alignSelf: 'flex-start',
    },
    buttoncontent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 5,
      paddingLeft: 5,
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
      height: 150,
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
  checkBoxAround: {
    width: WIDTH*0.28,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#155293',
    margin: 10,
  },
  buttonTextPequeño2: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 14,
    marginLeft: 5,
  },
  contenedorHorizontal: {
    flexDirection: 'row',
    //alignSelf: 'center',
  },
});