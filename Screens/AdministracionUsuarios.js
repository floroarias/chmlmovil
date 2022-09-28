import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Checkbox from 'expo-checkbox';

class AdministracionUsuarios extends React.Component {
  state = {
    isLoading: true,
    data: [],
    filtroAdmins: false,
    filtroComunes: false,
  } 

  async componentDidMount() {
    return await fetch('https://chmlmobile.chosmalal.net.ar/apiusuarios/v1/usuarioslistado.php')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          data: responseJson
        });
      });
  }

  //Usar la siguiente función en el manejo del activar/desactivar o eliminar delivery.
  _handleUpload = async (usuarioId, stateChange) => {
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.uploadChangesAsync(usuarioId, stateChange);
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

  async uploadChangesAsync(usuarioId, stateChange) {
    let apiUrl = 'https://delivery.chosmalal.net.ar/modificar_eliminar_usuario.php';
    
    let formData = new FormData();
    formData.append('usuarioId', usuarioId) //Usuario a modificar.
    formData.append('tipoDeCambio', stateChange)
    formData.append('id_usuario', this.props.usuario.idUsuario) //Usuario que realiza la modificación.
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

  static navigationOptions = {
    title: 'Administración de Usuarios - CHML Mobile', 
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
            CARGANDO USUARIOS ...
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
            NO HAY USUARIOS QUE MOSTRAR AQUÍ.
          </Text>
        </View>
      );
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    return (
      <View style={{backgroundColor: 'lightskyblue'}}>

          <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('DetalleUsuarioAdmin', {accion: 'agregar', usuario: null})}>
          <View style={styles.buttoncontent}>
            <Image style={styles.buttonImage}
              source={require('../assets/usuarios_admin.png')}
            />
            <Text style={styles.buttonText}> 
              Agregar Usuario
            </Text>
          </View>
          </TouchableHighlight>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño}>Administradores</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: -15}}
              value={this.state.filtroAdmins ? true : false}
              onValueChange={(valor) => this.setState({filtroAdmins: valor})}
            />
          </View>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño}>Usuarios Comunes</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: -15}}
              value={this.state.filtroComunes ? true : false}
              onValueChange={(valor) => this.setState({filtroComunes: valor})}
            />
          </View>

          <FlatList
            data={this.state.data}
            // keyExtractor={(item, key) => item.id}
            renderItem={({item, index}) =>   
                
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: index % 2 == 0 ? '#F5F5F5' : '#F5F5F5',
                  justifyContent: 'center'
                  }}>{/* El item de usuario contiene los datos del usuario
                  y dos botones (editar y eliminar) */}

                  <View>{/* texto descriptivo */}
                    <Image style={{width: 100, height: 100, margin: 2}} resizeMethod='scale' resizeMode='stretch' 
                      source={item.perfilusuario === 2 ? require('../assets/usuario_admin.png') : item.confirmado === 1 ? require('../assets/logueado.png'): require('../assets/avatar.png')}
                    />

                    <Text style={{
                      flex: 1,
                      flexDirection: 'column',
                      fontFamily: 'Roboto',
                      color: 'black',
                      fontSize: 13,
                      fontWeight: 'bold',
                      }}>
                      Mail: {item.mail}{"\n"}
                      Nombre: {item.nombre + ' ' + item.apellido}{"\n"}
                      Fecha de Alta.: {item.timestamp} - Confirmado: {item.confirmado === 1 ? 'Sí' : 'No'}{"\n"}
                      Tipo de Usuario: {item.perfilusuario === 2 ? 'Administrador' : 'Usuario Común'}
                    </Text>
                  </View>

                  <View>{/* Botones de activar/desactivar y eliminar */}
                    <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('DetalleUsuarioAdmin', {accion: 'modificar', usuario: item})}>
                      <View style={styles.buttoncontent}>
                        <Image style={styles.buttonImage}
                          source={require('../assets/editar.png')}
                        />
                        <Text style={styles.buttonText}>
                          Editar
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
  }
}

function mapStateToProps (state)  {
  return {
    usuarioRegistrado: state.usuarioLogInOut.usuarioRegistrado,
    usuario: state.usuarioLogInOut.usuario
  }
}

export default connect(mapStateToProps)(AdministracionUsuarios);

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
});