import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, 
Image, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Linking } from 'react-native';
const {width: WIDTH} = Dimensions.get('window');

export class Delivery extends React.Component {
    state = {
      isLoading: true,
      data: [],
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

  //Llama al primer teléfono de la lista (en caso de que haya más de uno).
  /* llamarTelefono = (telefonos) => {
    let arregloTelefonos = telefonos.split('/');
    let telefono1 = arregloTelefonos[1];
    
    Linking.openURL('tel:${telefono1}')
  } */

  static navigationOptions = {
    title: 'Deliverys - CHML Mobile', 
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
              Agregar Mi Delivery
            </Text>
          </View>
        </TouchableHighlight>

      <View style={{backgroundColor: 'lightskyblue'}}>   
          <FlatList
            data={this.state.data}
            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) => 
              
              <TouchableHighlight style={{width: WIDTH, borderWidth: 1, backgroundColor: 'lightskyblue'}} onPress={() => {
                let arregloTelefonos = item.telefono.split('/');
                let telefono1 = arregloTelefonos[0];
                //console.log(item.telefono)
                //console.log(arregloTelefonos)
                //console.log(telefono1)
                Linking.openURL('tel:' + telefono1)
              }}>
                
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: 'lightskyblue',
                  justifyContent: 'center'
                  }}> 

                <Image style={{width: 150, height: 150, margin: 2}} resizeMethod='scale' resizeMode='stretch' 
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
              </TouchableHighlight> //Fin del item
            }
          />

      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  facebook:{
    backgroundColor: '#155293',
  },
  button: {
    backgroundColor: 'red',
    width: 350,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    alignSelf: 'center'
  },
  buttonText: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    padding: 10,
  },
});