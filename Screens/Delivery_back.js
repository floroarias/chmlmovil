import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';

export class Delivery extends React.Component {
    state = {
      isLoading: true,
      data: [],
      activarZoom: false,
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
            CARGANDO LISTADO ...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar las información. */
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'skyblue'}}>

          <FlatList
            data={this.state.data}
            keyExtractor={(item, key) => item.idComercio}
            renderItem={({item}) => 
              <TouchableHighlight>
                <View style={styles.buttoncontent}>
                <Image style={styles.buttonImage} 
                  source={require('../assets/delivery1.png')}
                />

                <Text style={{
                  backgroundColor: 'aqua', borderColor: 'black', borderWidth: 1, fontSize: 14, padding: 2,
                  width: undefined, height: undefined, fontWeight: "bold"
                  }}>
                  {item.nombrecomercio}{"\n"}
                  {item.direccion}{"\n"} 
                  Teléfonos: {item.telefono}{"\n"}
                  {item.observaciones}
                </Text>
                </View>
              </TouchableHighlight>
            }
          />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue',
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
});