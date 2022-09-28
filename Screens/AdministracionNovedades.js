import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, 
Image, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');
import { ActivityIndicator } from 'react-native';

class AdministracionNovedades extends React.Component {
  state = {
    isLoading: true,
    images: [],
    resultadoSubida: false,
  }

  async componentDidMount() {
    return await fetch('https://chmlmobile.chosmalal.net.ar/novedades/obtener_novedades.php')
      .then(response => response.json())
      .then(responseJson => {
        let dataSource = [];
        
        Object.values(responseJson).forEach(item => {
          dataSource = dataSource.concat('https://chmlmobile.chosmalal.net.ar/novedades/' + item.nombre_imagen);
        });
        
        this.setState({
          isLoading: false,
          images: dataSource
        });
      });
  }

  //Usar la siguiente función en el manejo de eliminar novedad.
  _handleUpload = async (novedadId) => {
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.uploadChangesAsync(novedadId);
      uploadResult = await uploadResponse.json();
      
      //console.log(uploadResult);
      if (uploadResult && uploadResult === 1){
        this.setState({
          resultadoSubida: true,
          isLoading: true, //Para obligar a recargar la info
        })
      }
      //console.log({ uploadResult });
      //alert(uploadResult.stringify())
    } catch (e) {
      //console.log(uploadResponse);
      //console.log({ uploadResult });
      //console.log(e);
      alert('Error. Asegúrese de estar conectado a internet.');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };

  async uploadChangesAsync(novedadId) {
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/novedades/apinovedades/v1/eliminar_novedad.php';
    
    let formData = new FormData();
    formData.append('novedadId', novedadId)
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

    //console.log('A PUNTO DE LLAMAR A LA API CON LAS SIG. OPCIONES:')
    //console.log(options)
    return fetch(apiUrl, options);
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Administración de Novedades - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  render() {
    if (this.state.isLoading) {
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
            CARGANDO LISTADO ...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    return (
      <View style={{backgroundColor: 'lightskyblue'}}>

          <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('DetalleNovedadAdmin')}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/novedades_admin.png')}
            />
            <Text style={styles.buttonText}> 
              Agregar Novedad
            </Text>
          </View>
          </TouchableHighlight>

          <FlatList
            data={this.state.data}
            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) =>   
                
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: index % 2 == 0 ? '#F5F5F5' : '#F5F5F5',
                  justifyContent: 'center'
                  }}>{/* El item de delivery contiene una imagen con los datos del comercio
                  y dos botones (activar/desactivar y eliminar) */}

                  <View>{/* Imágen + texto descriptivo */}
                    <Image style={{width: 100, height: 100, margin: 2}} resizeMethod='scale' resizeMode='stretch' 
                      source={{uri: item}}
                    />

                    <Text style={{
                      flex: 1,
                      flexDirection: 'column',
                      fontFamily: 'Roboto',
                      color: 'black',
                      fontSize: 13,
                      fontWeight: 'bold',
                      }}>
                        {item.observaciones !== null ? item.observaciones + '\n' : ''}
                        {item.fecha !== null ? item.fecha + '\n' : ''}
                    </Text>
                  </View>

                  <View>{/* Botón de eliminar */}

                    <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('DeliveryMain')}>
                      <View style={styles.buttoncontent}>
                        <Image style={styles.buttonImage}
                          source={require('../assets/papelera.png')}
                        />
                        <Text style={styles.buttonText}>
                          Eliminar
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                </View>//Fin del item.
              
            }
          />

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

export default connect(mapStateToProps)(AdministracionNovedades);

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
});