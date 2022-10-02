import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, 
Image, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');

class Administracion extends React.Component {

  static navigationOptions = () => {
    return {
      title: 'Administración - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>

          <Text style={styles.portadaText}>Pantalla de Administración</Text>
          
          <Image style={styles.portadaImage}
            source = {require('../assets/usuario_admin.png')}
            resizeMethod={'resize'}
            resizeMode={'contain'} 
            //imageStyle = {{resizeMode: 'center'}}
          />
        
        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('AdministracionDenuncias')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/denuncias_admin.png')}
          />
          <Text style={styles.buttonText}> 
            Administración de Denuncias
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('AdministracionNovedades')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/novedades_admin.png')}
          />
          <Text style={styles.buttonText}> 
          Administración de Novedades
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('AdministracionDeliverys')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/deliverys_admin.png')}
          />
          <Text style={styles.buttonText}> 
          Administración de Deliverys
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('AdministracionUsuarios')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/usuarios_admin.png')}
          />
          <Text style={styles.buttonText}> 
          Administración de Usuarios
          </Text>
        </View>
        </TouchableHighlight>

        </ScrollView>
      </View>
    );
  }
}

//El state que se pasa como parámetro hace referencia al de redux, no al de este componente.
const mapStateToProps = state => {
  return {
    mailOlvidoPass: state.verificarMail.mailOlvidoPass,
    respuestaServerMailExiste: state.verificarMail.respuestaServerMailExiste,
    respuestaServerCodigoCorrecto: state.verificarCodigo.resultadoChequeoDeCodigo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetearRespuestaServerFN: () => dispatch(resetearRespuestaServerAction()),
    verificarCodigoFN: (mail, codigo) => dispatch(verificarCodigoCorrectoAction(mail, codigo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Administracion);

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
});