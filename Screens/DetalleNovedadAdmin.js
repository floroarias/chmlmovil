import React from "react";
import { 
    StyleSheet, Text, View, TouchableHighlight,
    Image, TextInput, ScrollView, ActivityIndicator,
    Dimensions, KeyboardAvoidingView
  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
//import Constants from 'expo-constants';
//import * as Permissions from 'expo-permissions';
import { connect } from 'react-redux';
import CountDown from 'react-native-countdown-component';

const {width: WIDTH} = Dimensions.get('window');

class DetalleNovedadAdmin extends React.Component {
  state = {
    imagenNovedad: null,
    comentarios: '',
    uploading: false,
    resultadoSubida: false,
    subidaIntentada: false,
  }

  static navigationOptions = {
    title: 'Detalle Novedad - CHML Mobile', 
  };

  //Usar la siguiente función en el manejo del botón GuardarDelivery.
  _handleUpload = async () => {
    if (!this.validarDatos()){
      alert('Revise que todos los campos estén completos e intente nuevamente. La imágen es obligatoria también.')
      return false
    }

    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.uploadImageAsync(this.state.imagenNovedad.uri);
      uploadResult = await uploadResponse.json();
      
      //console.log(uploadResult);
      if (uploadResult){
        if (uploadResult === 1){//Subida exitosa
          this.setState({
            resultadoSubida: true, //Subida correcta.
            subidaIntentada: true, //Se realizó intento de subir la información.
          })
        }else{
          this.setState({
            resultadoSubida: false, //Subida incorrecta
            subidaIntentada: true, //Se realizó intento de subir la información.
          })
        }
      }
      //console.log({ uploadResult });
      //alert(uploadResult.stringify())
    } catch (e) {
      //console.log(uploadResponse);
      //console.log({ uploadResult });
      //console.log(e);
      alert('Error en la carga. Asegúrese de estar conectado a internet y de que todos los datos estén cargados.');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };

  async uploadImageAsync(uri) {
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/apinovedades/v1/subir_novedad.php';
    
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let auxExt = fileType
    if (fileType === 'jpg'){
      auxExt = 'jpeg'
    }
  
    let formData = new FormData();
    formData.append('imagen', {
      uri,
      name: `novedadMobile.${fileType}`,
      type: `image/${auxExt}`,
    });
    formData.append('comentarios', this.state.comentarios)
    formData.append('jwt', this.props.usuario.jwt)
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
    };

    //console.log('A PUNTO DE LLAMAR A LA API CON LAS SIG. OPCIONES:')
    //console.log(options)
    return fetch(apiUrl, options);
  }

  validarDatos = () => {
    return (this.state.comentarios.length > 0 && this.state.imagenNovedad)
  }

  mostrarImagePicker = () => {
    //Opciones para el componente image-picker
    this._pickImage
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
      });

      if (!result.cancelled) {
        this.setState({ imagenNovedad: result });
      }
      //console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  _pickCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
      });
      if (!result.cancelled) {
        this.setState({ imagenNovedad: result });
      }
      //console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    if (!this.props.usuarioRegistrado || !(this.props.usuario.perfilUsuario == 2)){
      return (
        <View style = {styles.container}>
  
          <Text>AGREGAR NOVEDAD - CHML MOBILE</Text>
          <Image 
              source = {require('../assets/error.png')} 
              imageStyle = {{resizeMode: 'contain'}}
          />
          <Text>DEBE ESTAR REGISTRADO Y SER ADMINISTRADOR PARA AGREGAR UNA NOVEDAD</Text>
        </View>
      )
    }

    if (this.state.uploading) {
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/novedades_admin.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            REGISTRANDO NOVEDAD...{"\n"}
            ESTA OPERACIÓN PUEDE DEMORAR ALGUNOS MINUTOS{"\n"}
            DEPENDIENDO DEL TAMAÑO DE LA IMAGEN Y DE SU CONEXIÓN A INTERNET.
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    /* Este método sólo se ejecuta si uploading es falso.
    Esto significa que se terminó de cargar la información o no se ha iniciado la subida. */
    if (this.state.subidaIntentada) { //Se ha intentado subir la información.
      if (this.state.resultadoSubida){ //La información se subió exitosamente.
        return (
          <View style = {styles.container}>
          
          <Text style={styles.portadaText}>
            La novedad ha sido registrada exitosamente.{"\n"}
            Será redirigido ahora a la pantalla de listado de novedades...
          </Text>
          
          <CountDown
            size={30}
            until={5}
            onFinish={() => this.props.navigation.navigate('Novedades')}
            onPress={() => this.props.navigation.navigate('Novedades')}
            digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
            digitTxtStyle={{color: '#1CC625'}}
            timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
            separatorStyle={{color: '#1CC625'}}
            timeToShow={['S']}
            timeLabels={{s: null}}
          />

          </View>
        )
      }else{
        alert('No se puedo registrar la novedad. Revise su conexión a internet.');
      }
    }

    return ( //Si nunca se intentó la subida, o si se intentó pero no se pudo.
      <View style = {styles.container}>
        <ScrollView>

        <Text style={styles.portadaText}>REGISTRAR NOVEDAD - CHML MOBILE</Text>
            
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Image source={require('../assets/novedades_admin.png')}
            style={styles.denunciaImage}
            resizeMethod={'resize'}
            resizeMode={'contain'}
          />
        </View>
        
        <View style={styles.container}>
        
        <View style={[styles.contenedorHorizontal, {marginBottom: -20}]}>
        <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={this._pickImage}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/galeria.png')}
            />
            <Text style={styles.buttonTextPequeño}> 
              Galería
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={this._pickCamera}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/camara.png')}
            />
            <Text style={styles.buttonTextPequeño}> 
              Cámara
            </Text>
          </View>
        </TouchableHighlight>
        </View>

        <KeyboardAvoidingView keyboardVerticalOffset = {120} behavior="padding">

        <View style={styles.inputContainer}>
        <Ionicons name={'clipboard-outline'} size={28} color={'rgba(255, 255, 255, 0.7)'}
          style={styles.inputIcon} />

        <TextInput
          onChangeText={(comentarios) => this.setState({comentarios})}
          style = {styles.input}
          placeholder = {'Comentarios'} 
          ref='comentarios'
          returnKeyType='next'
          placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
          underlineColorAndroid = 'transparent'
          value={this.state.comentarios}
        />
        </View>

        </KeyboardAvoidingView>

        <View style={styles.contenedorHorizontal}>
        <TouchableHighlight style={[styles.buttonDenunciar, styles.facebook, {marginBottom: 10}]} onPress={() => this._handleUpload()}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/novedades_admin.png')}
            />
            <Text style={styles.buttonText}> 
              Registrar Novedad
            </Text>
          </View>
        </TouchableHighlight>
        </View>

        </View>

        </ScrollView>

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

export default connect(mapStateToProps)(DetalleNovedadAdmin);

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
    //marginTop: 20
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
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,255,0.3)',
    justifyContent: 'center',
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    width: 250,
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 250,
    width: 250,
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  buttonTextPequeño: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 14,
    padding: 10,
  },
  portadaImage: {
    width: WIDTH * 0.9, 
    height: 100,
    alignSelf: 'center',
  },
  denunciaImage: {
    width: WIDTH * 0.9, 
    height: 150,
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
  buttonHorizontal: {
    //backgroundColor: 'red',
    width: WIDTH*0.4,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
  },
  buttonDenunciar: {
    //backgroundColor: 'red',
    width: WIDTH*0.5,
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
});