import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, 
Image, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
const {width: WIDTH} = Dimensions.get('window');

class Denuncias extends React.Component {
    state = {
      variable: 'valor',
    };

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Denuncias - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  render() {
    let todasDenuncias
    if (this.props.usuarioRegistrado && this.props.usuario.perfilUsuario == 2){
      todasDenuncias = (
        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('AdminTodasLasDenuncias')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/denuncias_admin.png')}
          />
          <Text style={styles.buttonText}> 
            TODAS LAS DENUNCIAS
          </Text>
        </View>
        </TouchableHighlight>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView>

          <Text style={styles.portadaText}>DENUNCIAS DEL CIUDADANO CHOSMALENSE</Text>
          <Text style={styles.portadaText}>Las denuncias privadas sólo podrán ser vistas por Ud. y por los Administradores del Municipio</Text>
          
          <Image style={styles.portadaImage}
            source = {require('../assets/screen_denuncias.png')}
            resizeMethod={'resize'}
            resizeMode={'contain'} 
            //imageStyle = {{resizeMode: 'center'}}
          />
        
        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('NuevaDenunciaDetalle')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/logo_denuncia.png')}
          />
          <Text style={styles.buttonText}> 
            NUEVA DENUNCIA
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('MisDenuncias')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/denuncias_listado.png')}
          />
          <Text style={styles.buttonText}> 
            VER MIS DENUNCIAS
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('TodasLasDenunciasPublicas')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/denuncias_publicas.png')}
          />
          <Text style={styles.buttonText}> 
            VER DENUNCIAS PUBLICAS
          </Text>
        </View>
        </TouchableHighlight>

        {todasDenuncias}

        </ScrollView>
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

export default connect(mapStateToProps)(Denuncias);

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