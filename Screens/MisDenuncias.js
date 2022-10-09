import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

class MisDenuncias extends React.Component {
    state = {
      isLoading: true,
      data: [],
    } 

  async componentDidMount() {
    if (this.props.usuarioRegistrado){
      var formData = new FormData()
      formData.append('id_usuario', this.props.usuario.idUsuario)
      formData.append('jwt', this.props.usuario.jwt)
      //console.log(formData)

      return await fetch('https://chmlmobile.chosmalal.net.ar/denuncias/obtener_denuncias.php', {
        method: 'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            isLoading: false,
            data: responseJson
          });
          //console.log(responseJson)
        })
        .catch((err) => {
          //console.log("ERROR:")
          //console.log(err)
          alert('Error en los datos, intente nuevamente.')
        })
    }else{//Usuario no registrado.
      this.setState({
        isLoading: false,
      });
    }
  }

  static navigationOptions = {
    title: 'Mis Denuncias - CHML Mobile', 
  };

  render() {
    if (!this.props.usuarioRegistrado){
      return (
        <View style = {styles.container}>
  
          <Text style={styles.portadaText}>Listado de Denuncias del Ciudadano - CHML Mobile</Text>
          <Image 
              source = {require('../assets/error.png')} 
              imageStyle = {{resizeMode: 'contain'}}
          />
          <Text style={styles.portadaText}>Debe estar registrado para ver denuncias.</Text>
        </View>
      )
    }

    if (this.state.isLoading) {
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/denuncias_listado.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            Cargando Denuncias...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    //Reviso que la información cargada no esté vacía.
    if (this.state.data.length == 0 || this.state.data == 0){//El usuario es correcto, pero no tiene denuncias.
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 150, height: 150}}
            source={require('../assets/torreon_solo.png')}
            resizeMethod={'resize'}
            resizeMode={'contain'}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            Usted no ha realizado denuncias aún.
          </Text>
        </View>
      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    return (
      <View style={{backgroundColor: 'lightskyblue'}}>

          <FlatList
            data={this.state.data}
            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) => 
              
              <TouchableHighlight onPress={() => {
                console.log(item)
              }}>
                
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: 'lightskyblue',
                  justifyContent: 'center'
                  }}> 

                <Image style={styles.imagenDenuncia} resizeMethod='scale' resizeMode='stretch' 
                  source={{uri: 'https://denuncias.chosmalal.net.ar/imagenes/' + item.imagen}}
                />

                <Text style={{
                  flex: 1,
                  flexDirection: 'column',
                  fontFamily: 'Roboto',
                  fontSize: 13,
                  fontWeight: 'bold',
                  margin: 0.3,
                  }}>
                  Tipo de Denuncia: {item.tipo_denuncia == 1 ? 'PRIVADA' : 'PUBLICA'}{"\n"}
                  {"\n"}Descripción: {item.descripcion}{"\n"}
                  Fecha:
                  {' ' + item.fecha.substring(8,10) + '/' +
                  item.fecha.substring(5,7) + '/' +
                  item.fecha.substring(0,4)}{"\n"}
                  Dirección: {item.direccion}{"\n"}
                </Text>
                
                </View>
              </TouchableHighlight> //Fin del item
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

export default connect(mapStateToProps)(MisDenuncias);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightskyblue',
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
  imagenDenuncia:{
    width: 300,
    height: 300,
    margin: 2
  }
});