import React from 'react';
import { Alert, StyleSheet, Text, View, TouchableHighlight,
Image, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');

class DetalleImpuesto extends React.Component {
    state = {
      isLoading: true,
      data: []
    }

  static navigationOptions = {
    title: 'Cuentas Contribuyente - CHML Mobile', 
  }

  async componentDidMount() {
    var formData = new FormData()
    formData.append('cuenta_id', this.props.cuentaSeleccionada.id)
    
    return await fetch('http://mobileapp.chosmalal.gob.ar/obtener_deuda_cuenta.php', {
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
      this.setState({
          isLoading: false,
          data: responseJson
        });
    })

    .catch(err => {
      alert(
        'Se ha producido un error durante la carga de datos. Verifique su conexión a internet.'
      )
      this.props.navigation.navigate('Impuestos')
    })
  }

  render() {
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
            Cargando Detalle de la Cuenta...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    //Reviso que la información cargada no esté vacía.
    if (this.state.data.length == 0){//La cuenta no tiene detalle...
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 50, height: 50}}
            source={require('../assets/error.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            NO SE CUENTA CON INFORMACIÓN DE LA CUENTA SOLICITADA.
          </Text>
        </View>
      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    let cuotasImpagas = this.state.data.filter( item => {
      return (item.pagado == "0" && item.anulado == "0")
    })

    //console.log(this.state.data)
    //console.log(cuotasImpagas)

    return (
      <View style={styles.container}>
        <ScrollView>

        <View style = {styles.portada}>
          
          <Image style={styles.portadaImage}
            source = {require('../assets/logo_chml_web.png')}
            resizeMethod={'resize'}
            resizeMode={'contain'} 
            //imageStyle = {{resizeMode: 'center'}}
          />
          
          <Text style={styles.portadaText}>Contribuyente: {this.props.contribuyente.nombres + ' ' + this.props.contribuyente.apellido}</Text>
          <Text style={styles.portadaText}>Detalle de Impuesto:</Text>
          <Text style={styles.portadaText}>{this.props.cuentaSeleccionada.info_cuenta}</Text>
        </View>
        
        <View style={styles.container}>
          {cuotasImpagas.length > 0 ?
          <FlatList
            data={cuotasImpagas}
            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) => 
              
              <TouchableHighlight style={{width: WIDTH, borderWidth: 1}} onPress={() => {
                console.log(item);
              }}>

                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  //backgroundColor: index % 2 == 0 ? '#273BCF' : '#27CF73',
                  justifyContent: 'center',
                  width: WIDTH,
                  }}> 

                <Image style={{width: 60, height: 60, margin: 2}} resizeMethod='scale' resizeMode='stretch' 
                  source = {require('../assets/lista_cuotas.png')}
                />

                <Text style={{
                  flex: 1,
                  flexDirection: 'column',
                  fontFamily: 'Roboto',
                  color: 'black',
                  fontSize: 13,
                  fontWeight: 'bold',
                  marginLeft: 10
                  }}>
                  Cuota: {item.periodo}{"\n"}
                  Vencimiento:
                  {' ' + item.fecha_vto1.substring(8,10) + '/' +
                  item.fecha_vto1.substring(5,7) + '/' +
                  item.fecha_vto1.substring(0,4)}{"\n"}
                  Valor: ${item.importe_vto1}{"\n"}
                </Text>
                </View>
              </TouchableHighlight> //Fin del item
            }
          />
          :
          <Text style={styles.portadaText}>NO TIENE CUOTAS IMPAGAS</Text>
          }
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
    //console.log('MAP-STATE-TO-PROPS EN CLASE IMPUESTOS')
    //console.log(state)
    return {
        cuentaSeleccionada: state.seleccionarCuenta.cuentaSeleccionada,
        contribuyente: state.cargarDatosContribuyente.contribuyente,
        //logueado: state.dniLogin.logueado
    }
}

function mapDispatchToProps (dispatch) {
    return{
        seleccionarCuenta: cuenta => dispatch(seleccionarCuentaAction(cuenta)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetalleImpuesto);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightskyblue',
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
    alignSelf: 'flex-start',
    fontSize: 14,
    padding: 5,
  },
  portadaImage: {
    width: WIDTH * 0.9, 
    height: 60,
    alignSelf: 'center',
    margin: 10
  },
});