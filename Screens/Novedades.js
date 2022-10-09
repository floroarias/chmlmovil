import React from 'react';
import { Dimensions, StyleSheet, View, Image, Text, FlatList } from 'react-native';
//import { SliderBox } from "react-native-image-slider-box";
import { ActivityIndicator } from 'react-native';

export class Novedades extends React.Component {
    state = {
      isLoading: true,
      images: [],
      /* images: [
        "https://chmlmobile.chosmalal.net.ar/noticias/1.jpg",
        "https://chmlmobile.chosmalal.net.ar/noticias/2.jpg",
      ] */
    };

  async componentDidMount() {
    return await fetch('https://chmlmobile.chosmalal.net.ar/novedades/obtener_novedades.php')
      .then(response => response.json())
      .then(responseJson => {
        let dataSource = [];
        
        Object.values(responseJson).forEach((item) => {
          let imagen = 'https://chmlmobile.chosmalal.net.ar/novedades/' + item.nombre_imagen
          let fecha = item.fecha.substring(8,10) + '/' + item.fecha.substring(5,7) + '/' + item.fecha.substring(0,4)
          let observaciones = item.observaciones
          let objeto = {imagen: imagen, fecha: fecha, observaciones: observaciones}
          dataSource = dataSource.concat(objeto);
        });
        
        this.setState({
          isLoading: false,
          images: dataSource
        });
      });
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Novedades - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/novedades.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            Cargando Novedades...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar las información. */
    return (
      <View style={{backgroundColor: 'lightskyblue'}}>

          <FlatList
            data={this.state.images}
            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) =>   
                
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: 'lightskyblue',
                  justifyContent: 'center',
                  borderWidth: 1
                  }}>{/* El item de delivery contiene una imagen con los datos del comercio
                  y dos botones (activar/desactivar y eliminar) */}

                  <View>{/* Imágen + texto descriptivo */}
                    <Image
                      style={styles.imagenNovedad}
                      resizeMethod='scale' resizeMode='stretch' 
                      source={{uri: item.imagen}}
                    />

                    <Text style={{
                      flex: 1,
                      flexDirection: 'column',
                      fontFamily: 'Roboto',
                      color: 'black',
                      fontSize: 13,
                      fontWeight: 'bold',
                      marginLeft: 10,
                      }}>
                        {item.fecha ? ('Fecha: ' + item.fecha) : ''}
                        {item.observaciones ? 'Comentarios: ' + item.observaciones + '\n' : ''}
                    </Text>
                  </View>

                </View>//Fin del item.
              
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
  noticia:{
    //alignSelf: 'center', 
    //width: Dimensions.get('window').width, 
    //height: Dimensions.get('window').height,
    //marginBottom: 10,
    //marginTop: 10,
    //borderRadius: 10,
  },
  imagenNovedad:{
    width: Dimensions.get('window').width*0.9,
    height: Dimensions.get('window').width*1.3,
    alignSelf: 'center',
    margin: 10
  }
});