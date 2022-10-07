//Esta pantalla se usa tanto para editar como para agregar un usuario nuevo.
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
      <View style={{backgroundColor: '#155293'}}>

      <View style = {styles.container}>

        <ScrollView>

        <Text style={styles.portadaText}>Registro de Usuarios - CHML Mobile</Text>
        <Text style={styles.portadaText}>Usuario Administrador</Text>
        
        <Image style={styles.portadaImage}
        source = {require('../assets/usuario_admin.png')}
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
          <Ionicons name={'ios-lock'} size={28} color={'rgba(255, 255, 255, 0.7)'}
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
          <Ionicons name={'ios-lock'} size={28} color={'rgba(255, 255, 255, 0.7)'}
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

        </ScrollView>
                
        </View>

        <View style={[styles.contenedorHorizontal, {marginBottom: -20}]}>
        
          <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={() => this.props.navigation.navigate('AdministracionUsuarios')}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/cancel.png')}
              />
              <Text style={styles.buttonTextPequeño}> 
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
              <Text style={styles.buttonTextPequeño}> 
                Guardar Usuario
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
    alignItems: 'center',
    justifyContent: 'center',
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
  buttoncontent: {
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingLeft: 15,
  },
  buttonImage: {
    width: 40, 
    height: 40,
    alignSelf: 'center',
  },
  contenedorHorizontal:{
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH * 0.90, 
    height: 130,
    justifyContent: "space-between",
    marginBottom: -10,
    marginTop: -20,
    //borderRadius: 10,
  },
  buttonHorizontal: {
    //backgroundColor: 'red',
    width: WIDTH*0.4,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
  },
  checkBoxAround: {
    width: WIDTH*0.38,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#155293',
  },
  buttonTextPequeño2: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 14,
  },
});