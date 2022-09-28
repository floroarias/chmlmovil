import React from 'react';
import { Alert, StyleSheet, Text, View, TouchableHighlight, 
Image, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { seleccionarCuentaAction } from '../redux/ActionCreators';
import { contribuyenteCargaDatosActionSync } from '../redux/ActionCreators';
const {width: WIDTH} = Dimensions.get('window');

class Impuestos extends React.Component {
    state = {
      isLoading: true,
      data: []
    }

  static navigationOptions = {
    title: 'Detalle de Impuestos - CHML Mobile', 
  }

  async componentDidMount() {
    //if (!this.props.contribuyenteLogueado){//Si no está logueado, no hago nada.
    //  return
    //}

    //Este código sólo se ejecuta si el contribuyente está logueado y existe.
    var formData = new FormData()
    formData.append('tipo_documento', this.props.documento.tipoDoc)
    formData.append('nro_documento', this.props.documento.nroDoc)
    
    await fetch('https://chmlmobile.chosmalal.net.ar/registro_impuestos.php', {
      method: 'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    }).then(console.log('consulta registrada'))
    .catch(err => {console.log(err)})

    return await fetch('http://mobileapp.chosmalal.gob.ar/obtener_cuentas_contribuyente.php', {
      method: 'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })

    //.then(response => console.log(response.data))
    //.then(response => console.log(response.body))
    //.then(response => console.log(response.data))
    .then(response => response.json())
    .then(responseJson => {
      let contribuyente = {
        apellido: responseJson.apellido,
        nombres: responseJson.nombres,
      }
      this.props.cargarDatosContribuyente(contribuyente)
      this.setState({
          isLoading: false,
          data: responseJson
        });
    })
    .catch(err => {
      alert(
        'Se ha producido un error durante la carga de datos. Verifique la información ingresada y el acceso a internet.'
      )
      this.props.navigation.navigate('Identificarse')
    })
  }

  render() {
    //console.log('this.state')
    //console.log(this.state)
    //console.log('this.props')
    //console.log(this.props)
    if (!this.props.contribuyenteLogueado){//Si el contribuyente no está logueado, sólo muestro un mensaje de error.
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/error.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            EL USUARIO INGRESADO NO EXISTE.
          </Text>
        </View>
      );
    }

    if (this.state.isLoading) {
      //console.log(this.state.data)
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/impuestos.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            CARGANDO CUENTAS ...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    //Reviso que la información cargada no esté vacía.
    if (this.state.data.length == 0 || this.state.data == 0){//El usuario es correcto, pero no tiene cuentas.
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/error.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            EL USUARIO INGRESADO NO TIENE CUENTAS.
          </Text>
        </View>
      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    return (
      <View style={styles.container}>
        <ScrollView>

        <View style = {styles.portada}>
          <Text style={styles.portadaText}>LISTADO DE CUENTAS</Text>
          
          <Image style={styles.portadaImage}
            source = {require('../assets/logo_chml_web.png')}
            resizeMethod={'resize'}
            resizeMode={'contain'} 
            //imageStyle = {{resizeMode: 'center'}}
          />

          <Text style={styles.portadaText}>Contribuyente: {this.props.contribuyente.nombres + ' ' + this.props.contribuyente.apellido}</Text>
        </View>

        <View style={styles.contenido}>
          <FlatList
            data={this.state.data.cuentas}
            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) => 
              
              <TouchableHighlight style={{width: WIDTH, borderWidth: 1}} onPress={() => {
                this.props.seleccionarCuenta(item)
                this.props.navigation.navigate('DetalleImpuesto');
              }}>
                
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: index % 2 == 0 ? '#273BCF' : '#27CF73',
                  justifyContent: 'center',
                  width: WIDTH,
                  }}> 

                <Image style={{width: 40, height: 40, marginLeft: 4, marginRight: 6, marginTop: 10}} resizeMethod='scale' resizeMode='stretch' 
                  source = {item.impuesto_id == 1 ? require('../assets/inmuebles.png') : (item.impuesto_id == 2 ? require('../assets/comercio.png'):require('../assets/automotores.png'))}
                />

                <Text style={{
                  flex: 1,
                  flexDirection: 'column',
                  fontFamily: 'Roboto',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 'bold',
                  }}>
                  {item.impuesto_id == 1 ? "Tasa por Servicio a la Propiedad Inmueble" : (item.impuesto_id == 2 ? "Tasa de Comercio" : "Impuesto Automotor")}{"\n"}
                  {"\n"}{item.impuesto_id == 1 ? "Nomenclatura Catastral" : (item.impuesto_id == 2 ? "Nro. Padrón" : "Patente")}: {item.dato_busqueda}{"\n"}
                  Nro de Cuenta: {item.nro_cuenta}{"\n"}
                  {"\n"}Información de la Cuenta:{"\n"}{item.info_cuenta}{"\n"}
                  {"\n"}Código de Pago Electrónico: {item.codigo_gestio_web}{"\n"}
                </Text>
                </View>
              </TouchableHighlight> //Fin del item
            }
          />
        </View>

        </ScrollView>
      </View>
    );
  }
}

//Estas dos líneas son para dentro del render de cada item, como ejemplo.
//{item.observaciones !== null ? item.observaciones + '\n' : ''}
//Rubro: {this.mostrarRubros(item.rubros)}

//El state que se pasa como parámetro hace referencia al de redux, no al de este componente.
function mapStateToProps (state)  {
  return {
    documento: state.contribuyenteLogin.documento,
    contribuyenteLogueado: state.contribuyenteLogin.contribuyenteLogueado,
    contribuyente: state.cargarDatosContribuyente.contribuyente,
  }
}

function mapDispatchToProps (dispatch) {
    return{
        seleccionarCuenta: cuenta => dispatch(seleccionarCuentaAction(cuenta)),
        cargarDatosContribuyente: cuenta => dispatch(contribuyenteCargaDatosActionSync(cuenta)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Impuestos);

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightskyblue',
    justifyContent: 'center',
    width: WIDTH,
  },
  portada: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightskyblue',
    justifyContent: 'center',
    width: WIDTH,
  },
  contenido: {
    flex: 3,
    alignItems: 'center',
    backgroundColor: 'lightskyblue',
    justifyContent: 'center',
    width: WIDTH,
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
});