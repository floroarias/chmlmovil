import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, 
Image, Alert, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');
import Checkbox from 'expo-checkbox';

class AdministracionDenuncias extends React.Component {

  static navigationOptions = () => {
    return {
      title: 'Administración de Denuncias - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  state = {
    isLoading: true,
    data: [],
    filtroActivas: true,
    filtroInactivas: true,
    filtroPublicas: true,
    filtroPrivadas: true,
    dataFiltrada: [],
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
          console.log(err)
          alert('Error en los datos, intente nuevamente. Asegúrese de estar conectado a internet.')
        })

    }else{//Usuario no registrado.
      this.setState({
        isLoading: false,
      });
    }
  }

  //Si la denuncia es la indicada en el id, cambia su estado (activa/inactiva) o su tipo de publicidad (pública/privada).
  //Si no lo es, devuelve el objeto sin cambios.
  //1 es privada, 2 es pública.
  cambioActivaCambioPublicaDenuncia = (denuncia, stateChange, denunciaId) => {
    if (denuncia.id_denuncia != denunciaId){
      return denuncia
    }
    if (stateChange == 2){
      denuncia.activa = denuncia.activa == 1 ? 0 : 1 // ACTIVO/DESACTIVO.
      return denuncia
    }
    if (stateChange == 3){
      denuncia.tipo_denuncia = denuncia.tipo_denuncia == 1 ? 2 : 1 // PÚBLICA/PRIVADA. 1 es privada, 2 es pública.
      return denuncia
    }
        
    return denuncia
  }

  confirmarEliminacion = (denuncia) => {

    Alert.alert(
      "Advertencia",
      "Está seguro de eliminar la denuncia?",
      [
        {
          text: "Cancelar",
          onPress: () => resultado = false,
          style: "cancel"
        },
        { text: "Confirmar", onPress: () => this._handleUpload(denuncia, 1) }
      ],
      { cancelable: false }
    )
  }

  //Usar la siguiente función en el manejo del cambio de estado pública/privada o activa/inactiva y de la eliminación también.
  _handleUpload = async (denuncia, stateChange) => {
    //stateChange: 1 ES ELIMINAR, 2 ES ACTIVAR/DESACTIVAR, 3 es PUBLICA/PRIVADA.
    let uploadResponse, uploadResult;

    try {
      this.setState({
        isLoading: true
      });

      uploadResponse = await this.uploadChangesAsync(denuncia, stateChange);
      uploadResult = await uploadResponse.json();
      
      console.log(uploadResult)

      if (uploadResult && uploadResult == 5){
        if (stateChange == 1){ //Si era una eliminación, quito el objeto del listado.
          this.setState({
            data: this.state.data.filter(item => item.id_denuncia != denuncia.id_denuncia)
          });
        }else{ //Si era un cambio de estado, actualizo el objeto en el listado.
            this.setState({
              data: this.state.data.map(item => this.cambioActivaCambioPublicaDenuncia(item, stateChange, denuncia.id_denuncia))
            });
        }

        alert('La operación se ha realizado exitosamente.');
      }
    } catch (e) {
      alert('Error. Asegúrese de estar conectado a internet.');
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  async uploadChangesAsync(denuncia, stateChange) {
    //console.log('uploadChangesAsync')
    let apiUrl = 'https://chmlmobile.chosmalal.net.ar/denuncias/modificar_eliminar_denuncia.php';
    
    let formData = new FormData();
    formData.append('denuncia_id', denuncia.id_denuncia)
    formData.append('tipo_de_cambio', stateChange)
    formData.append('activa', denuncia.activa) //1 activa, 0 inactiva.
    formData.append('tipo_denuncia', denuncia.tipo_denuncia) //1 privada, 2 pública.
    formData.append('id_usuario_admin', this.props.usuario.idUsuario)
    formData.append('jwt_usuario_admin', this.props.usuario.jwt)
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
    };

    return await fetch(apiUrl, options);
  }

  render () {
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
            Cargando denuncias...
          </Text>
          <ActivityIndicator size= "large" color='#0000ff'/>
        </View>

      );
    }

    //Reviso que la información cargada no esté vacía.
    if (this.state.data.length == 0){//El usuario es correcto, pero no hay denuncias.
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
            No hay denuncias/reclamos realizados por ciudadanos.
          </Text>
        </View>
      );
    }

    //Filtro la información de acuerdo a los checkboxes.
    let dataFiltrada = this.state.data
    if (!this.state.filtroPublicas){
      dataFiltrada = dataFiltrada.filter(item => item.tipo_denuncia != 2)
    }
    if (!this.state.filtroPrivadas){
      dataFiltrada = dataFiltrada.filter(item => item.tipo_denuncia != 1)
    }
    if (!this.state.filtroActivas){
      dataFiltrada = dataFiltrada.filter(item => item.activa != 1)
    }
    if (!this.state.filtroInactivas){
      dataFiltrada = dataFiltrada.filter(item => item.activa != 0)
    }

    /* Este método sólo se ejecuta si isLoading es falso.
    Esto significa que se terminó de cargar la información. */
    return (
      <View style={styles.container}>
        
        <View style={styles.contenedorHorizontal}>

          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Públicas</Text>
            <Checkbox
              style={{alignSelf: 'center'}}
              value={this.state.filtroPublicas}
              onValueChange={(valor) => this.setState({filtroPublicas: valor})}
            />
          </View>


          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Privadas</Text>
            <Checkbox
              style={{alignSelf: 'center'}}
              value={this.state.filtroPrivadas}
              onValueChange={(valor) => this.setState({filtroPrivadas: valor})}
            />
          </View>
        
          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Activas</Text>
            <Checkbox
              style={{alignSelf: 'center'}}
              value={this.state.filtroActivas}
              onValueChange={(valor) => this.setState({filtroActivas: valor})}
            />
          </View>
        
          <View style={styles.checkBoxAround}>
            <Text style={styles.buttonTextPequeño2}>Inactivas</Text>
            <Checkbox
              style={{alignSelf: 'center'}}
              value={this.state.filtroInactivas}
              onValueChange={(valor) => this.setState({filtroInactivas: valor})}
            />
          </View>
        
        </View>

        <View>
        <FlatList
            data={dataFiltrada}

            // keyExtractor={(item, key) => item.idComercio}
            renderItem={({item, index}) => 
              
              <TouchableHighlight onPress={() => {
                console.log(item)
              }}>
                
                <View style={{
                    //flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderWidth: 1,
                    alignItems: 'center',
                    width: WIDTH,
                  }}>

                  <View>

                    <Image style={{width: WIDTH*0.90, height: WIDTH*0.90*1.2, marginTop: 10}} resizeMethod='scale' resizeMode='stretch' 
                      source={{uri: 'https://denuncias.chosmalal.net.ar/imagenes/' + item.imagen}}
                    />

                    <Text style={styles.descripcionDenuncia}>
                      Tipo de Denuncia: {item.tipo_denuncia == '1' ? 'Privada' : 'Pública'}{"\n"}
                      Descripción: {item.descripcion}{"\n"}
                      Fecha:
                      {' ' + item.fecha.substring(8,10) + '/' +
                      item.fecha.substring(5,7) + '/' +
                      item.fecha.substring(0,4)}{"\n"}
                    </Text>

                  </View>

                  <View style={styles.botonesCostadoJuntos}>
                  
                  <View style={styles.botonesCostado}>
                  <TouchableHighlight onPress={() => this._handleUpload(item, 3)}>
                  <Text style={styles.buttonTextPequeño2}>
                      {item.tipo_denuncia == '1' ? 'Marcar como Pública' : 'Marcar como Privada'}
                  </Text>
                  </TouchableHighlight>
                  </View>
                  
                  <View style={styles.botonesCostado}>
                  <TouchableHighlight onPress={() => this._handleUpload(item, 2)}>
                  <Text style={styles.buttonTextPequeño2}>
                      {item.activa == '1' ? 'Desaprobar' : 'Aprobar'}
                  </Text>
                  </TouchableHighlight>
                  </View>

                  <View style={styles.botonesCostado}>
                  <TouchableHighlight onPress={() => this.confirmarEliminacion(item)}>
                  <Text style={styles.buttonTextPequeño2}>
                      Eliminar
                  </Text>
                  </TouchableHighlight>
                  </View>

                  </View>
                
                </View>
              </TouchableHighlight> //Fin del item
            }
        />
        </View>

      </View>
    );

  } //Render

}

function mapStateToProps (state)  {
  return {
    usuarioRegistrado: state.usuarioLogInOut.usuarioRegistrado,
    usuario: state.usuarioLogInOut.usuario
  }
}

export default connect(mapStateToProps)(AdministracionDenuncias);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightskyblue',
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: 10,
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
  logo:{
    //alignSelf: 'center', 
    //width: 268, 
    height: 130,
    //marginBottom: 10,
    //marginTop: 10,
    //borderRadius: 10,
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
    height: 100,
    alignSelf: 'center',
  },
  checkBoxAround: {
    width: WIDTH*0.20,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#155293',
  },
  buttonTextPequeño2: {
    fontFamily: 'Roboto',
    color: 'white',
    alignSelf: 'center',
    fontSize: 14,
  },
  contenedorHorizontal:{
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH * 0.90, 
    height: 150,
    justifyContent: "space-between",
    marginBottom: -20,
    marginTop: 80,
    //borderRadius: 10,
  },
  buttonHorizontal: {
    //backgroundColor: 'red',
    width: WIDTH*0.4,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
  },
  botonesCostadoJuntos:{
    flexDirection: 'row',
  },
  botonesCostado: {
    width: WIDTH*0.27,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    //marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#155293',
    margin: 10,
  },
  descripcionDenuncia: {
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 14,
  },
});