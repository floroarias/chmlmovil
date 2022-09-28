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
//import DatePicker from 'react-native-datepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from 'expo-location';
import Checkbox from 'expo-checkbox';
import { connect } from 'react-redux';

const {width: WIDTH} = Dimensions.get('window');

class NuevaDenunciaDetalle extends React.Component {
  state = {
    isDatePickerVisible: false,
    location: '',
    direccion: '',
    descripcion: '',
    fecha: new Date(),
    imagenDenuncia: null,
    uploading: false,
    resultadoSubida: false,
    tipoDenuncia: 1,
  }

  static navigationOptions = {
    title: 'Datos Nueva Denuncia - CHML Mobile', 
  };

  componentDidMount() {
    //this.getPermissionAsync()
    this._getLocationAsync()
  };

  //componentWillMount(){
  //  this._getLocationAsync();
  //}
  
  //Usar la siguiente función en el manejo del botón GuardarDenuncia.
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

      uploadResponse = await this.uploadImageAsync(this.state.imagenDenuncia.uri);
      uploadResult = await uploadResponse.json();
      
      //console.log(uploadResult);
      if (uploadResult && uploadResult === 1){
        this.setState({
          resultadoSubida: true,
        })
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
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/denuncias/guardar_denuncia.php';
    
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let auxExt = fileType
    if (fileType === 'jpg'){
      auxExt = 'jpeg'
    }
  
    let formData = new FormData();
    formData.append('imagen', {
      uri,
      name: `denunciaMobile.${fileType}`,
      type: `image/${auxExt}`,
    });
    formData.append('descripcion', this.state.descripcion)
    formData.append('fecha', this.state.fecha.toJSON().substring(0,10))
    formData.append('direccion', this.state.direccion)
    formData.append('geolocalizacion', this.state.location)
    formData.append('id_usuario', this.props.usuario.idUsuario)
    formData.append('jwt', this.props.usuario.jwt)
    formData.append('tipo_denuncia', this.state.tipoDenuncia)
  
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
    return (this.state.direccion.length > 0 && this.state.descripcion.length > 0 && this.state.imagenDenuncia)
  }

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  handleConfirm = (date) => {
    //console.log(date);
    this.hideDatePicker();
    this.setState({
        fecha: date
    });
  };

  mostrarImagePicker = () => {
    //Opciones para el componente image-picker
    this._pickImage
  };

  _getLocationAsync = async () => {
    let ubicacion
    let tienePermiso = await Permissions.getAsync(Permissions.LOCATION)
    //console.log(tienePermiso)
    if (tienePermiso.status === 'granted'){//Si tiene permisos de acceder a ubicación, la obtengo.
      try{
        ubicacion = await Location.getCurrentPositionAsync({});
        ubicacion = JSON.stringify(ubicacion.coords)
      }catch(e){
        //console.log(e)
        ubicacion = 'SIN DATOS'
      }
      
    }else{//No tiene permiso de acceso a la ubicación, los pido.
      let { autorizaPermiso } = await Permissions.askAsync(Permissions.LOCATION);
      if (autorizaPermiso === 'granted'){//Si autoriza los permisos, obtengo la ubicación.
        ubicacion = await Location.getCurrentPositionAsync({});
        ubicacion = JSON.stringify(ubicacion.coords)
      }else{//No tiene permisos y no autoriza.
        ubicacion = 'SIN DATOS'
      }
    }
    //console.log('UBICACION: ' + ubicacion);

    this.setState({location: ubicacion});
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Lo sentimos, se requiere permiso para acceder a la galería para esta función.');
      }
    }
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
        this.setState({ imagenDenuncia: result });
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
        this.setState({ imagenDenuncia: result });
      }
      //console.log(result);
    } catch (e) {
      console.log(e);
    }
  };
  
  render() {
    //console.log(this.state)

    if (!this.props.usuarioRegistrado){
      return (
        <View style = {styles.container}>
  
          <Text style={styles.portadaText}>DENUNCIAS DEL CIUDADANO - CHML MOBILE</Text>
          <Image 
              source = {require('../assets/error.png')} 
              imageStyle = {{resizeMode: 'contain'}}
          />
          <Text style={styles.portadaText}>SE REQUIERE ESTAR REGISTRADO PARA SUBIR DENUNCIAS</Text>
        </View>
      )
    }

    let dia = this.state.fecha.getDate()
    if (dia < 10){
      dia = '0' + dia
    }
    let mes = this.state.fecha.getMonth() + 1
    if (mes < 10){
      mes = '0' + mes
    }
    let anio = this.state.fecha.getFullYear()
    let fechaDenunciaMostrar = dia + '/' + mes + '/' + anio
    //console.log(fechaDenunciaMostrar)

    if (this.state.uploading) {
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>

          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/logo_denuncia.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            SUBIENDO DENUNCIA, ESPERE POR FAVOR ...{"\n"}
            ESTA OPERACIÓN PUEDE DEMORAR ALGUNOS MINUTOS{"\n"}
            DEPENDIENDO DEL TAMAÑO DE LA IMAGEN Y DE SU CONEXIÓN A INTERNET
          </Text>
          <ActivityIndicator color="#0000ff" size="large" />
        
        </View>
      );
    }

    let imagen = this.state.imagenDenuncia 
      ? <Image 
          source={{ uri: this.state.imagenDenuncia.uri }}
          style={styles.denunciaImage}
          resizeMethod={'resize'}
          resizeMode={'contain'}
        /> 
      : <Image source={require('../assets/logo_denuncia.png')}
          style={styles.denunciaImage}
          resizeMethod={'resize'}
          resizeMode={'contain'}
        />

    if (this.state.resultadoSubida){//Si la denuncia ya ha sido subida, muestro los datos y la opción de volver al inicio.
      return (
        <View style = {styles.container}>

        <ScrollView>

        <Text style={styles.portadaText}>DENUNCIA REALIZADA - CHML MOBILE</Text>
        
        <Image style={styles.portadaImage}
          source = {require('../assets/screen_denuncias.png')}
          resizeMethod={'resize'}
          resizeMode={'contain'} 
          //imageStyle = {{resizeMode: 'center'}}
        />
        
        <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
          {imagen}
        </View>

        <Text  style={[styles.portadaText]}>
          Tipo de Denuncia: {this.state.tipoDenuncia == 1 ? 'PRIVADA' : 'PÚBLICA'}{"\n"}
          Fecha: {fechaDenunciaMostrar}{"\n"}
          Dirección: {this.state.direccion}{"\n"}
          Descripción: {this.state.descripcion}{"\n"}
        </Text>
        
        {/* <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Home')}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/home.png')}
            />
            <Text style={styles.buttonText}> 
              Volver al Inicio
            </Text>
          </View>
        </TouchableHighlight> */}

        </ScrollView>

        </View>
      );
    }

    return (
      <View style = {styles.container}>
      <ScrollView>

      <Text style={styles.portadaText}>NUEVA DENUNCIA - CHML MOBILE</Text>
      
      {/* <Image style={styles.portadaImage}
        source = {require('../assets/screen_denuncias.png')}
        resizeMethod={'resize'}
        resizeMode={'contain'} 
        //imageStyle = {{resizeMode: 'center'}}
      /> */}
      
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {imagen}
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
      <Ionicons name={'ios-home'} size={28} color={'rgba(255, 255, 255, 0.7)'}
        style={styles.inputIcon} />

      <TextInput
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
      <Ionicons name={'ios-chatboxes'} size={28} color={'rgba(255, 255, 255, 0.7)'}
        style={styles.inputIcon} />

      <TextInput
        multiline={true}
        numberOfLines={4}
        onChangeText={(descripcion) => this.setState({descripcion})}
        style = {styles.input}
        placeholder = {'Breve Descripción'} 
        ref='descripcion'
        returnKeyType='next'
        placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
        underlineColorAndroid = 'transparent'
        value={this.state.descripcion}
      />
      </View>

      </KeyboardAvoidingView>
      
      <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.showDatePicker()}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/calendario.png')}
          />
          <Text style={styles.buttonTextPequeño}> 
            Fecha: {fechaDenunciaMostrar}
          </Text>
        </View>
      </TouchableHighlight>

      <DateTimePickerModal
        isVisible={this.state.isDatePickerVisible}
        mode="date"
        display="calendar"
        date={this.state.fecha}
        onConfirm={(date) => this.handleConfirm(date)}
        onCancel={() => this.hideDatePicker()}
      />

      <View style={styles.contenedorHorizontal}>
      <View style={styles.checkBoxAround}>
      <Text style={styles.buttonTextPequeño}>Denuncia Pública</Text>
      <Checkbox
        style={{alignSelf: 'center', marginTop: -15}}
        value={this.state.tipoDenuncia == 1 ? false : true}
        onValueChange={(valor) => valor == true ? this.setState({tipoDenuncia: 2}) : this.setState({tipoDenuncia: 1})}
      />
      </View>

      <TouchableHighlight style={[styles.buttonDenunciar, styles.facebook, {marginBottom: 10}]} onPress={() => this._handleUpload()}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/logo_denuncia.png')}
          />
          <Text style={styles.buttonText}> 
            Denunciar
          </Text>
        </View>
      </TouchableHighlight>
      </View>

      </View>

      </ScrollView>

    </View>
    );
  }
 
} //Cierre de la clase.

function mapStateToProps (state)  {
    return {
      usuarioRegistrado: state.usuarioLogInOut.usuarioRegistrado,
      usuario: state.usuarioLogInOut.usuario
    }
}

export default connect(mapStateToProps)(NuevaDenunciaDetalle);

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