import React from 'react';
import { View, TouchableHighlight, Image } from 'react-native';
import { connect } from 'react-redux';

class BotonLogin extends React.Component {
    render() {
      return (
        <TouchableHighlight onPress = {() => this.props.nav.navigate('Login')}>
          <View>
            <Image style={{width: 40, height: 40, marginRight: 10}}
              source= {this.props.usuarioRegistrado ? require('../assets/logueado.png') : require('../assets/avatar.png')}
            />
          </View>
        </TouchableHighlight>
      );
    }
};

//El state que se pasa como parámetro hace referencia al de redux, no al de este componente.
const mapStateToProps = state => {
  return {
    usuarioRegistrado: state.usuarioLogInOut.usuarioRegistrado,
    //usuario: state.usuarioLogIn.usuario
  }
}

export default connect(mapStateToProps)(BotonLogin);