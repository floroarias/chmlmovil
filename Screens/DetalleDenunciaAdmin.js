import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, 
Image, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');

class DetalleDenunciaAdmin extends React.Component {

  state = {
    uploading: false,
    resultadoSubida: false,
    subidaIntentada: false,
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Detalle de Denuncia - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  //Usar la siguiente función en el manejo del botón activar/desactivar o eliminar.
  _handleUpload = async () => {
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.uploadImageAsync(this.state.imagenLogo.uri);
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
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/denuncias/modificar_eliminar_denuncia.php';
    
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let auxExt = fileType
    if (fileType === 'jpg'){
      auxExt = 'jpeg'
    }
  
    let formData = new FormData();
    formData.append('imagen', {
      uri,
      name: `deliveryMobile.${fileType}`,
      type: `image/${auxExt}`,
    });
    formData.append('nombreComercio', this.state.nombreComercio)
    formData.append('telefono', this.state.telefono)
    formData.append('direccion', this.state.direccion)
    formData.append('observaciones', this.state.observaciones)
    formData.append('jwt', this.props.usuario.jwt)
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
    };
  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#d2fae4',
        justifyContent: 'center'
        }}> 

      <Image style={styles.denunciaImage} resizeMethod='scale' resizeMode='stretch' 
        source={{uri: 'https://denuncias.chosmalal.net.ar/imagenes/' + item.imagen}}
      />

      <Text style={{
        flex: 1,
        flexDirection: 'column',
        fontFamily: 'Roboto',
        fontSize: 13,
        fontWeight: 'bold',
        }}>
        Tipo de Denuncia: {item.tipo_denuncia == 1 ? 'PRIVADA' : 'PUBLICA'}{"\n"}
        {"\n"}Usuario: {item.nombre + ' '}{item.apellido}{"\n"}
        Contacto: {item.mail + ' '}{item.telefono}{"\n"}
        Descripción: {item.descripcion}{"\n"}
        Fecha:
        {' ' + item.fecha.substring(8,10) + '/' +
        item.fecha.substring(5,7) + '/' +
        item.fecha.substring(0,4)}{"\n"}
        Dirección: {item.direccion}{"\n"}
      </Text>

        <View style={[styles.contenedorHorizontal, {marginBottom: -20}]}>
        
          <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={this._pickImage}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/galeria.png')}
              />
              <Text style={styles.buttonTextPequeño}> 
                Activar/Desactivar
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={this._pickCamera}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/camara.png')}
              />
              <Text style={styles.buttonTextPequeño}> 
                Eliminar
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

export default connect(mapStateToProps)(DetalleDenunciaAdmin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'red',
    width: 350,
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
  impuestos:{
    backgroundColor: '#155293',
  },
  facebook:{
    backgroundColor: '#155293',
  },
  twitter:{
    backgroundColor: '#155293',
  },
  instagram:{
    backgroundColor: '#155293',
  },
  noticias:{
    backgroundColor: '#155293',
  },
  logo:{
    //alignSelf: 'center', 
    //width: 268, 
    height: 130,
    //marginBottom: 10,
    //marginTop: 10,
    //borderRadius: 10,
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
    height: 100,
    alignSelf: 'center',
  },
  denunciaImage: {
    width: WIDTH * 0.9, 
    height: 150,
    alignSelf: 'center',
  },
  buttonHorizontal: {
    //backgroundColor: 'red',
    width: WIDTH*0.4,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
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
});