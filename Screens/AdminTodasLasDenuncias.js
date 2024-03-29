import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

class AdminTodasLasDenuncias extends React.Component {
    state = {
      isLoading: true,
      data: [],
    } 

  async componentDidMount() {
    if (this.props.usuarioRegistrado && (this.props.usuario.perfilUsuario == 2)){
      var formData = new FormData()
      formData.append('perfil_usuario', this.props.usuario.perfilUsuario)
      formData.append('id_usuario', this.props.usuario.idUsuario)
      formData.append('jwt', this.props.usuario.jwt)

      return await fetch('https://chmlmobile.chosmalal.net.ar/denuncias/obtener_todas_denuncias.php', {
        method: 'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson)
          this.setState({
            isLoading: false,
            data: responseJson
          });
        })
        .catch((err) => {
          //console.log("ERROR:")
          //console.log(err)
          alert('Error en los datos, intente nuevamente. Asegúrese de estar conectado a internet.')
        })

    }else{//Usuario no registrado.
      this.setState({
        isLoading: false,
      });
    }
  }

  static navigationOptions = {
    title: 'Todas Las Denuncias - CHML Mobile', 
  };

  render() {
    if (!this.props.usuarioRegistrado || !(this.props.usuario.perfilUsuario == 2)){
      return (
        <View style = {styles.container}>
  
          <Text>LISTADO DE TODAS LAS DENUNCIAS DE LOS CIUDADANOS - CHML MOBILE</Text>
          <Image 
              source = {require('../assets/error.png')} 
              imageStyle = {{resizeMode: 'contain'}}
          />
          <Text>DEBE ESTAR REGISTRADO Y SER ADMINISTRADOR PARA VER ESTAS DENUNCIAS.</Text>
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
    if (this.state.data.length == 0 || this.state.data == 0){//El usuario es correcto, pero no hay denuncias.
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
            NO HAY DENUNCIAS QUE MOSTRAR AQUÍ.
          </Text>
        </View>
      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    return (
      <View style={{backgroundColor: '#155293'}}>

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
                  margin: 0.3
                  }}>
                  Tipo de Denuncia: {item.tipo_denuncia == 1 ? 'PRIVADA' : 'PUBLICA'}{"\n"}
                  {"\n"}Usuario: {item.nombre + ' '}{item.apellido}{"\n"}
                  Mail: {item.mail + '\n'}
                  Teléfono: {item.telefono}{"\n"}
                  Descripción: {item.descripcion}{"\n"}
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

export default connect(mapStateToProps)(AdminTodasLasDenuncias);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#155293',
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
  imagenDenuncia:{
    width: 300,
    height: 300,
    margin: 2
  }
});