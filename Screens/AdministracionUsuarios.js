import React from 'react';
import { StyleSheet, Text, Alert, View, TouchableHighlight, Image, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Checkbox from 'expo-checkbox';
const {width: WIDTH} = Dimensions.get('window');

class AdministracionUsuarios extends React.Component {
  state = {
    isLoading: true,
    data: [],
    filtroAdmins: true,
    filtroComunes: true,
  } 

  async componentDidMount() {
    return await fetch('https://chmlmobile.chosmalal.net.ar/apiusuarios/v3/usuarioslistado.php')
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        this.setState({
          isLoading: false,
          data: responseJson
        });
      });
  }

  eliminarUsuario = async (usuario) => {
    if (usuario.id_usuario == this.props.usuario.idUsuario){
      alert('No puede eliminarse a sí mismo!!')
      return false
    }

    let resultado = false

    Alert.alert(
      "Eliminar Usuario",
      "Está seguro de que desea eliminar el usuario?",
      [
        {
          text: "Cancelar",
          onPress: () => {resultado = false},
          style: "cancel"
        },
        { text: "Confirmar", onPress: await this.eliminarUsuarioAsync(usuario) }
      ],
      { cancelable: false }
    )
    //console.log(resultado)
    return resultado
  }

  eliminarUsuarioAsync = async (usuario) => {
    
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      uploadResponse = await this.uploadChangesAsyncUsuario(usuario);
      uploadResult = uploadResponse.json();

      console.log(uploadResponse)

      //console.log(uploadResult);
      if (uploadResult && uploadResult == 5){
        this.setState({
          data: this.state.data.filter(item => item.id_usuario != usuario.id_usuario),
        })
        alert('El usuario se eliminó correctamente.');
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
  }

  async uploadChangesAsyncUsuario(usuario) {
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/apiusuarios/v2/modificar_eliminar_usuario.php';

    let formData = new FormData();

    formData.append('mail', usuario.mail)
    formData.append('id_usuario', usuario.id_usuario)
    formData.append('id_usuario_admin', this.props.usuario.idUsuario)
    formData.append('jwt_usuario_admin', this.props.usuario.jwt)
    formData.append('operacion', 2) //Tipo Operación: 1 es modificar, 2 es eliminar.
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    return await fetch(apiUrl, options);
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
            Cargando Usuarios...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    //Reviso que la información cargada no esté vacía.
    if (this.state.data.length == 0){//
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
            No hay usuarios que mostrar.
          </Text>
        </View>
      );
    }

    //Filtro la información de acuerdo a los checkboxes.
    let dataFiltrada = this.state.data
    //dataFiltrada = dataFiltrada.filter(item => item.idUsuario != this.props.usuario.idUsuario) //Sólo muestro usuarios distintos al actual.
    
    if (!this.state.filtroAdmins){
      dataFiltrada = dataFiltrada.filter(item => item.perfil_usuario != 2)
    }
    if (!this.state.filtroComunes){
      dataFiltrada = dataFiltrada.filter(item => item.perfil_usuario != 1)
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

        <View style={styles.checksHorizontales}>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Administradores</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: 5}}
              value={this.state.filtroAdmins}
              onValueChange={(valor) => this.setState({filtroAdmins: valor})}
            />
          </View>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Usuarios Comunes</Text>
            <Checkbox
              style={{alignSelf: 'center', marginTop: 5}}
              value={this.state.filtroComunes}
              onValueChange={(valor) => this.setState({filtroComunes: valor})}
            />
          </View>

        </View>

        <View style={{marginBottom: 300}}>
          <FlatList
            data={dataFiltrada}
            renderItem={({item, index}) =>   
                
                <View style={styles.itemLista}>

                  <View style={styles.imagenBotones}>
                  <View>
                    <Image style={{width: 150, height: 150, margin: 2}} resizeMethod='scale' resizeMode='stretch' 
                      source={item.perfil_usuario == 2 ? require('../assets/usuario_admin.png') : item.confirmado == 1 ? require('../assets/logueado.png'): require('../assets/avatar.png')}
                    />
                  </View>

                  <View style={styles.botonesActivarEliminar}>
                  
                    <TouchableHighlight style={[styles.button2, styles.facebook]} onPress={() => this.props.navigation.navigate('DetalleUsuarioAdmin', {accion: 'editar', usuario: item})}>
                      <View style={styles.buttoncontent}>
                        <Image style={styles.buttonImage}
                          source={require('../assets/editar.png')}
                        />
                        <Text style={styles.buttonText}>
                          Editar
                        </Text>
                      </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.button2, styles.facebook]} onPress={(item) => this.eliminarUsuario(item)}>
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
                  </View>

                  <Text style={styles.textoDescriptivo}>
                    Mail: {item.mail}{"\n"}
                    Nombre: {item.nombre + ' ' + item.apellido}{"\n"}
                    Fecha de Alta.: {item.timestamp}{"\n"}
                    Confirmado: {item.confirmado == 1 ? 'Sí' : 'No'}{"\n"}
                    Tipo de Usuario: {item.perfil_usuario == 2 ? 'Administrador' : 'Usuario Común'}
                  </Text>

                </View>
              
            }
          />
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

export default connect(mapStateToProps)(AdministracionUsuarios);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#155293',
    flexDirection: 'column',
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
  checkBoxAround: {
    width: WIDTH*0.38,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#155293',
    margin: 10,
  },
  buttonTextPequeño2: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 14,
  },
  facebook:{
    backgroundColor: '#155293',
  },
  button: {
    backgroundColor: 'red',
    width: WIDTH*0.8,
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
  checksHorizontales:{
    flexDirection: 'row',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    padding: 10,
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
    //flex: 1,
    flexDirection: 'row',
  },
  textoDescriptivo: {
    //flex: 1,
    flexDirection: 'column',
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});