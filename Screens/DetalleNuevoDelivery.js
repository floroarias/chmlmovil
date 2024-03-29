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
import DropDownPicker from 'react-native-dropdown-picker';

const {width: WIDTH} = Dimensions.get('window');

class DetalleNuevoDelivery extends React.Component {
  state = {
    isLoading: true,
    nombreComercio: '',
    telefono: '',
    direccion: '',
    imagenLogo: null,
    observaciones: '',
    uploading: false,
    resultadoSubida: false,
    subidaIntentada: false,
    data: [],
    open: false,
    value: null,
    items: [],
  }

  setValue = (callback) => {
    this.setState({ value: callback() })
  }

  //setValue(callback) {
  //  this.setState(state => ({
  //    value: callback(state.value)
  //  }));
  //}

  setOpen = (open) => this.setState({ open })

  setItems = (items) => this.setState({ items })

  static navigationOptions = {
    title: 'Detalle Nuevo Delivery - CHML Mobile', 
  };

  async componentDidMount() {
    return await fetch('https://delivery.chosmalal.net.ar/rubros.php')
      .then(response => response.json())
      .then(responseJson => {
        let rubros = []
        responseJson.forEach(element => {
          const newRubro = {
            label: element.nombrerubro,
            value: element.nombrerubro
          }
          rubros.push(newRubro)
        });
        //console.log('rubros')
        //console.log(rubros)
        //console.log('responseJson')
        //console.log(responseJson)
        this.setItems(rubros)
        this.setState({
          isLoading: false,
        });
      });
  }

  //Usar la siguiente función en el manejo del botón GuardarDelivery.
  _handleUpload = async () => {
    if (!this.validarDatos()){
      alert('Revise que todos los campos estén completos e intente nuevamente. La imágen es obligatoria también.')
      return false
    }

    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true,
        subidaIntentada: true,
      });

      //console.log(this.state.imagenLogo.uri)

      uploadResponse = await this.uploadImageAsync(this.state.imagenLogo.uri);
      uploadResult = await uploadResponse.json();
      
      console.log(uploadResult);
      if (uploadResult){
        if (uploadResult == 5){//Subida exitosa
          this.setState({
            resultadoSubida: true, //Subida correcta.
            subidaIntentada: true, //Se realizó intento de subir la información.
          })
        }else{
          alert('Error en la carga. Asegúrese de estar conectado a internet y de que todos los datos estén cargados.');
          //this.setState({
            //resultadoSubida: false, //Subida incorrecta
            //subidaIntentada: true, //Se realizó intento de subir la información.
          //})
        }
      }
      //console.log({ uploadResult });
      //alert(uploadResult.stringify())
    } catch (e) {
      //console.log(uploadResponse);
      //console.log({ uploadResult });
      //console.log(e);
      alert('Error. Asegúrese de estar conectado a internet y de que todos los datos estén cargados.');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };

  async uploadImageAsync(uri) {
    let apiUrl = 'https://delivery.chosmalal.net.ar/v1/subir_nuevo_delivery.php';
    
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let auxExt = fileType
    if (fileType === 'jpg'){
      auxExt = 'jpeg'
    }

    //let rubrosSeleccionados = this.state.value.map((rubro) => ({
    //  nombrerubro: rubro.value
    //}));

    //let rubrosSeleccionados = this.state.value;
    //let rubrosSeleccionadosJSON = rubrosSeleccionados.json();
  
    let formData = new FormData();

    formData.append('imagen', {
      uri,
      name: `deliveryMobile.${fileType}`,
      type: `image/${auxExt}`,
    });
    formData.append('nombrecomercio', this.state.nombreComercio)
    formData.append('telefono', this.state.telefono)
    formData.append('direccion', this.state.direccion)
    formData.append('observaciones', this.state.observaciones)
    formData.append('rubros', this.state.value)
    formData.append('id_usuario', this.props.usuario.idUsuario)
    formData.append('jwt', this.props.usuario.jwt)
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
    };

    console.log('A PUNTO DE LLAMAR A LA API CON LAS SIG. OPCIONES:')
    console.log(options)
    return await fetch(apiUrl, options);
  }

  validarDatos = () => {
    return (this.state.direccion.length > 0 && this.state.nombreComercio.length > 0 
      && this.state.imagenLogo && this.state.observaciones.length > 0 
      && this.state.telefono.length > 0 && this.state.value)
  }

  mostrarImagePicker = () => {
    //Opciones para el componente image-picker
    this._pickImage
  };

  _pickImage = async () => {
    //const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
      });

      if (!result.cancelled) {
        this.setState({ imagenLogo: result });
      }
      //console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  _pickCamera = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync()
    //console.log(permiso)
    if (!permiso.granted){
      return false
    }
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
      });
      if (!result.cancelled) {
        this.setState({ imagenLogo: result });
      }
      //console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    if (!this.props.usuarioRegistrado){
      return (
        <View style = {styles.container}>
  
          <Text>Agregar Nuevo Delivery - CHML Mobile</Text>
          <Image 
              source = {require('../assets/error.png')} 
              imageStyle = {{resizeMode: 'contain'}}
          />
          <Text>Debe estar registrado para agregar un delivery</Text>
        </View>
      )
    }

    if (this.state.uploading) {
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/registrar_delivery.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            Registrando Delivery...{"\n"}
            Esta operación puede demorar algunos minutos dependiendo{"\n"}
            del tamaño de la imágen y de la velocidad de su conexión.
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
            El nuevo delivery ha sido registrado.{"\n"}
            Un Administrador lo revisará para aprobarlo antes de que sea público.{"\n"}
            Será redirigido ahora a la pantalla de inicio...
          </Text>
          
          <CountDown
            size={30}
            until={5}
            onFinish={() => this.props.navigation.navigate('Home')}
            onPress={() => this.props.navigation.navigate('Home')}
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
    }

    let imagen = this.state.imagenLogo
      ? <Image 
          source={{ uri: this.state.imagenLogo.uri }}
          style={styles.denunciaImage}
          resizeMethod={'resize'}
          resizeMode={'contain'}
        /> 
      : <Image source={require('../assets/registrar_delivery.png')}
          style={styles.denunciaImage}
          resizeMethod={'resize'}
          resizeMode={'contain'}
        />

    //console.log('this.state.items')
    //console.log(this.state.items)
    //console.log(this.state)
    return ( //Si nunca se intentó la subida, o si se intentó pero no se pudo.
      <View style = {styles.container}>

        <Text style={styles.portadaText}>Nuevo Delivery - CHML Mobile</Text>
            
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {imagen}
        </View>
        
        <View style={styles.container}>
        
        <View style={styles.contenedorHorizontal}>
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
        <Ionicons name={'cart'} size={28} color={'rgba(255, 255, 255, 0.7)'}
          style={styles.inputIcon} />

        <TextInput
          onChangeText={(nombreComercio) => this.setState({nombreComercio})}
          style = {styles.input}
          placeholder = {'Nombre del Comercio'} 
          ref='nombreComercio'
          returnKeyType='next'
          placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
          underlineColorAndroid = 'transparent'
          value={this.state.nombreComercio}
        />
        </View>

        <View style={(styles.inputContainer, {marginTop: 10})}>
        <Ionicons name={'ios-home'} size={28} color={'rgba(255, 255, 255, 0.7)'}
          style={styles.inputIcon} />

        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={(direccion) => this.setState({direccion})}
          style = {styles.input}
          placeholder = {'Dirección'} 
          ref='direccion'
          returnKeyType='next'
          placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
          underlineColorAndroid = 'transparent'
          value={this.state.direccion}
        />
        </View>

        <View style={(styles.inputContainer, {marginTop: 10})}>
        <Ionicons name={'logo-whatsapp'} size={28} color={'rgba(255, 255, 255, 0.7)'}
          style={styles.inputIcon} />

        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={(telefono) => this.setState({telefono})}
          style = {styles.input}
          placeholder = {'Teléfono'} 
          ref='telefono'
          returnKeyType='next'
          placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
          underlineColorAndroid = 'transparent'
          value={this.state.telefono}
        />
        </View>

        <View style={(styles.inputContainer, {marginTop: 10})}>
        <Ionicons name={'clipboard-outline'} size={28} color={'rgba(255, 255, 255, 0.7)'}
          style={styles.inputIcon} />

        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={(observaciones) => this.setState({observaciones})}
          style = {styles.input}
          placeholder = {'Observaciones'} 
          ref='observaciones'
          returnKeyType='next'
          placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
          underlineColorAndroid = 'transparent'
          value={this.state.observaciones}
        />
        </View>

        </KeyboardAvoidingView>
        
        <View style={{margin: 10}}>
        <DropDownPicker
            open={this.state.open}
            placeholder = {'Seleccione el rubro'} 
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.35)"
            }}
            value={this.state.value}
            items={this.state.items}
            setOpen={this.setOpen}
            setValue={this.setValue}
            setItems={this.setItems}
            containerStyle={{
              width: WIDTH*0.9,
            }}
            textStyle={{
              fontSize: 15,
              color: 'black',
            }}
          />
        </View>

        <View style={styles.contenedorHorizontal}>

          <TouchableHighlight style={[styles.buttonDenunciar, styles.facebook, {marginBottom: 10}]} onPress={() => this._handleUpload()}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/registrar_delivery.png')}
              />
              <Text style={styles.buttonText}> 
                Registrar Delivery
              </Text>
            </View>
          </TouchableHighlight>
        
        </View>

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

export default connect(mapStateToProps)(DetalleNuevoDelivery);

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
    //marginTop: 10,
  },
  buttonDenunciar: {
    //backgroundColor: 'red',
    width: WIDTH*0.9,
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