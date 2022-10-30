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
    filtroActivos: true,
    filtroInactivos: true,
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

  //Si el comercio es el indicado en el id, cambia su estado (activo/inactivo).
  //Si no lo es, devuelve el objeto sin cambios.
  activarDesactivarComercio = (item, stateChange, deliveryId) => {
    let activo = stateChange == 2 ? 1 : 0 //stateChange: 2 ES ACTIVAR, 3 es DESACTIVAR.
    let comercio = item
    if (item.idcomercio == deliveryId){
      comercio.activo = activo
      return comercio
    }
    
    return comercio
  }

  //Usar la siguiente función en el manejo del activar/desactivar o eliminar delivery.
  _handleUpload = async (deliveryId, stateChange) => {
    //stateChange: 1 ES ELIMINAR, 2 ES ACTIVAR, 3 es DESACTIVAR.
    if (stateChange == 1){
      Alert.alert(
        "Eliminar Delivery",
        "Está seguro de que desea eliminar el comercio?",
        [
          {
            text: "Cancelar",
            onPress: () => {return false},
            style: "cancel"
          },
          { text: "Confirmar", onPress: () => {} }
        ],
        { cancelable: false }
      )
    }

    let uploadResponse, uploadResult;

    try {
      this.setState({
        isLoading: true
      });

      uploadResponse = await this.uploadChangesAsync(deliveryId, stateChange);
      uploadResult = uploadResponse.json();
      
      //console.log(uploadResult);
      if (uploadResult && uploadResult == 5){
        if (stateChange == 1){ //Si era una eliminación, quito el objeto del listado.
          this.setState({
            data: data.filter(item => item.idcomercio != deliveryId)
          });
        }else{ //Si era un cambio de estado, actualizo el objeto en el listado.
            this.setState({
              data: data.map(item => activarDesactivarComercio(item, stateChange, deliveryId))
            });
        }
        alert('La operación se ha realizado exitosamente.');
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
        isLoading: false
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
            Cargando Listado...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }
    
    //Filtro la información de acuerdo a los checkboxes.
    let dataFiltrada = this.state.data
    if (!this.state.filtroActivos){
      dataFiltrada = dataFiltrada.filter(item => item.activo != 1)
    }
    if (!this.state.filtroInactivos){
      dataFiltrada = dataFiltrada.filter(item => item.activo != 0)
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

          <View style={styles.checksHorizontales}>
      
          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Activos</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: 5}}
              value={this.state.filtroActivos ? true : false}
              onValueChange={(valor) => this.setState({filtroActivos: valor})}
            />
          </View>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Inactivos</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: 5}}
              value={this.state.filtroInactivos ? true : false}
              onValueChange={(valor) => this.setState({filtroInactivos: valor})}
            />
          </View>
      
          </View>

          <View style={{marginBottom: 300}}>
          <FlatList
            data={dataFiltrada}
            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) =>   
                
                <View style={styles.itemLista}>{/* El item de delivery contiene una imagen con los datos del comercio
                  y dos botones (activar/desactivar y eliminar) */}

                  <View style={styles.imagenBotones}>{/* Imágen + botones */}
                    <Image style={{width: 150, height: 150, margin: 2}} resizeMethod='scale' resizeMode='stretch' 
                      source={{uri: 'https://delivery.chosmalal.net.ar/imagenes/' + item.imagen}}
                    />

                  <View style={styles.botonesActivarEliminar}>{/* Botones de activar/desactivar y eliminar */}
                    
                    <TouchableHighlight style={[styles.button2, styles.facebook]} onPress={item.activo == 1 ? (item) => this._handleUpload(item, 3) : (item) => this._handleUpload(item, 2)}>
                      <View style={styles.buttoncontent}>
                        <Image style={styles.buttonImage}
                          resizeMethod={'resize'}
                          resizeMode={'contain'}
                          source={item.activo ? require('../assets/off.png') : require('../assets/on.png')}
                        />
                        <Text style={styles.buttonText}>
                          {item.activo == 1 ? 'Desactivar' : 'Activar'}
                        </Text>
                      </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.button2, styles.facebook]} onPress={(item) => this._handleUpload(item, 1)}>
                      <View style={styles.buttoncontent}>
                        <Image style={styles.buttonImage}
                          source={require('../assets/papelera.png')}
                        />
                        <Text style={styles.buttonText}>
                          Eliminar
                        </Text>
                      </View>
                    </TouchableHighlight>
                  
                  </View>{/* Botones de activar/desactivar y eliminar */}

                  </View>{/* Imágen + botones */}

                  <Text style={styles.textoDescriptivo}>
                      {item.nombrecomercio}{"\n"}
                      {"\n"}{item.direccion}{"\n"}
                      Tel.: {item.telefono}{"\n"}
                      {item.observaciones !== null ? item.observaciones + '\n' : ''}
                      Rubro: {this.mostrarRubros(item.rubros)}
                    </Text>

                </View> //Fin del item (imágen + botones y debajo el texto).
              
            }
          />
          </View>

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
    width: WIDTH*0.9,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
    alignSelf: 'center',
  },
  button2: {
    backgroundColor: 'red',
    width: WIDTH*0.4,
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
    width: WIDTH*0.25,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#155293',
    marginHorizontal:10,
  },
  checksHorizontales:{
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 10,
  },
  buttonTextPequeño2: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 14,
  },
  itemLista: {
      flex: 1,
      flexDirection: 'column',
      //marginLeft: 10,
      borderWidth: 1,
      //backgroundColor: index % 2 == 0 ? '#F5F5F5' : '#F5F5F5',
      //justifyContent: 'center'
  },
  botonesActivarEliminar: {
    marginLeft: 10,
  },
  imagenBotones: {
    flex: 1,
    flexDirection: 'row',
  },
  textoDescriptivo: {
    flex: 1,
    flexDirection: 'column',
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});