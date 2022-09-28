import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, ScrollView } from 'react-native';

export class RedesSociales extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Redes Sociales - CHML Mobile',
    };
  };

  render() {
    return (
      <View style={styles.container}>
        
        <Image style={styles.logo}
          source={require('../assets/redes_sociales.png')}
        />
        
        <ScrollView>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Facebook')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/facebook.png')}
          />
          <Text style={styles.buttonText}> 
            FACEBOOK CHML 
          </Text>
        </View>
        </TouchableHighlight>
        
        <TouchableHighlight style={[styles.button, styles.twitter]} onPress={() => this.props.navigation.navigate('Twitter')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/twitter.png')}
          />
          <Text style={styles.buttonText}> 
            TWITTER CHML
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.instagram]} onPress={() => this.props.navigation.navigate('Instagram')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/instagram.png')}
          />
          <Text style={styles.buttonText}> 
            INSTAGRAM CHML
          </Text>
        </View>
        </TouchableHighlight>
        
        <TouchableHighlight style={[styles.button, styles.noticias]} onPress={() => this.props.navigation.navigate('Noticias')}>
        <View style={styles.buttoncontent}> 
          <Image style={styles.buttonImage}
            source={require('../assets/noticias2.png')}
          />
          <Text style={styles.buttonText}> 
            NOTICIAS CHML
          </Text>
          </View>
        </TouchableHighlight>

        </ScrollView>
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
  logo:{
    alignSelf: 'center', 
    width: 271, 
    height: 90,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
  },
});
