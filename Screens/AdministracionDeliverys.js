import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, 
Image, ScrollView, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');
import Checkbox from 'expo-checkbox';
import { ActivityIndicator } from 'react-native';

class AdministracionDeliverys extends React.Component {
  state = {
    isLoading: true,
    data: [],
    filtroActivos: false,
    filtroInactivos: false,
  }

  async componentDidMount() {
    return await fetch('https://delivery.chosmalal.net.ar/deliverylistado.php')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          data: responseJson
        });
      });
  }

  mostrarRubros = (rubros) => {
    const listItems = rubros.map(
        (item) => <Text>{item.rubro}{" "}</Text>
      )

    return (listItems)
  }

  //Usar la siguiente función en el manejo del activar/desactivar o eliminar delivery.
  _handleUpload = async (deliveryId, stateChange) => {
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.uploadChangesAsync(deliveryId, stateChange);
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
      alert('Error. Asegúrese de estar conectado a internet.');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };

  async uploadChangesAsync(deliveryId, stateChange) {
    let apiUrl = 'https://delivery.chosmalal.net.ar/modificar_eliminar_delivery.php';
    
    let formData = new FormData();
    formData.append('deliveryId', deliveryId)
    formData.append('tipoDeCambio', stateChange)
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
      title: 'Administración de Deliverys - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/delivery.png')}
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

          <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('DetalleNuevoDelivery')}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/deliverys_admin.png')}
            />
            <Text style={styles.buttonText}> 
              Agregar Delivery
            </Text>
          </View>
          </TouchableHighlight>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño}>Activos</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: -15}}
              value={this.state.filtroActivos ? true : false}
              onValueChange={(valor) => this.setState({filtroActivos: valor})}
            />
          </View>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño}>Inactivos</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: -15}}
              value={this.state.filtroInactivos ? true : false}
              onValueChange={(valor) => this.setState({filtroInactivos: valor})}
            />
          </View>

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
                      source={{uri: 'https://delivery.chosmalal.net.ar/imagenes/' + item.imagen}}
                    />

                    <Text style={{
                      flex: 1,
                      flexDirection: 'column',
                      fontFamily: 'Roboto',
                      color: 'black',
                      fontSize: 13,
                      fontWeight: 'bold',
                      }}>
                      {item.nombrecomercio}{"\n"}
                      {"\n"}{item.direccion}{"\n"}
                      Tel.: {item.telefono}{"\n"}
                      {item.observaciones !== null ? item.observaciones + '\n' : ''}
                      Rubro: {this.mostrarRubros(item.rubros)}
                    </Text>
                  </View>

                  <View>{/* Botones de activar/desactivar y eliminar */}
                    <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('DeliveryMain')}>
                      <View style={styles.buttoncontent}>
                        <Image style={styles.buttonImage}
                          source={item.activo ? require('../assets/off.png') : require('../assets/on.png')}
                        />
                        <Text style={styles.buttonText}>
                          {item.activo ? 'Desactivar' : 'Activar'}
                        </Text>
                      </View>
                    </TouchableHighlight>

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
  } //Render
    
} //Class

function mapStateToProps (state)  {
  return {
    usuarioRegistrado: state.usuarioLogInOut.usuarioRegistrado,
    usuario: state.usuarioLogInOut.usuario
  }
}

export default connect(mapStateToProps)(AdministracionDeliverys);

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