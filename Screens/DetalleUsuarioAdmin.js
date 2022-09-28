//Esta pantalla se usa tanto para editar como para agregar un usuario nuevo.
//Solo usuarios de tipo Admin.
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');

class DetalleUsuarioAdmin extends React.Component {
    state = {
      isLoading: true,
    } 

  async componentDidMount() {
    if (this.props.usuarioRegistrado){
      var formData = new FormData()
      formData.append('perfil_usuario', this.props.usuario.perfilUsuario)
      formData.append('id_usuario', this.props.usuario.idUsuario)
      formData.append('jwt', this.props.usuario.jwt)

      return await fetch('https://chmlmobile.chosmalal.net.ar/apiusuarios/v1/modificar_eliminar_usuario.php', {
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
    title: 'Detalle de Usuario - CHML Mobile', 
  };

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{margin: 20, flexDirection: 'column', alignItems: 'center'}}>
          <Image style={{
            margin: 20, width: 60, height: 60}}
            source={require('../assets/usuarios_admin.png')}
          />
          <Text style={{
            margin:10, padding: 10, backgroundColor: 'coral', borderColor: 'blue', borderWidth: 1,
            borderRadius: 4, fontWeight: 'bold', fontSize: 10
            }}>
            Cargando datos del usuario ...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    return (
      <View style={{backgroundColor: '#155293'}}>

        <View style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: index % 2 == 0 ? '#273BCF' : '#27CF73',
          justifyContent: 'center'
        }}> 

          <Image style={{width: 100, height: 100, margin: 2}} resizeMethod='scale' resizeMode='stretch' 
            source={require('../assets/usuario_admin.png')}
          />

          <Text style={{
            flex: 1,
            flexDirection: 'column',
            fontFamily: 'Roboto',
            fontSize: 13,
            fontWeight: 'bold',
          }}>
            DATOS DEL USUARIO:{"\n"}
            Mail: {item.mail}{"\n"}
            Nombre: {item.nombre + ' ' + item.apellido}{"\n"}
            Fecha de Alta.: {item.timestamp} - Confirmado: {item.confirmado === 1 ? 'Sí' : 'No'}{"\n"}
            Tipo de Usuario: {item.perfilusuario === 2 ? 'Administrador' : 'Usuario Común'}
          </Text>
                
        </View>

        <View style={[styles.contenedorHorizontal, {marginBottom: -20}]}>
        
          <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={this._pickImage}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/cancel.png')}
              />
              <Text style={styles.buttonTextPequeño}> 
                Cancelar
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.buttonHorizontal, styles.facebook]} onPress={this._pickCamera}>
            <View style={styles.buttoncontent}>
              <Image style={styles.buttonImage}
                source={require('../assets/ok.png')}
              />
              <Text style={styles.buttonTextPequeño}> 
                Guardar Usuario
              </Text>
            </View>
          </TouchableHighlight>
        
        </View>
      
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

export default connect(mapStateToProps)(DetalleUsuarioAdmin);

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
  contenedorHorizontal:{
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH * 0.90, 
    height: 130,
    justifyContent: "space-between",
    marginBottom: -10,
    marginTop: -20,
    //borderRadius: 10,
  },
  buttonHorizontal: {
    //backgroundColor: 'red',
    width: WIDTH*0.4,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
  },
});