import React from 'react';
import { StyleSheet, Text, View,
  TouchableHighlight, Image, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import { Linking } from 'react-native';
//import { SliderBox } from "react-native-image-slider-box";
//import BotonLogin from './BotonLogin'
const {width: WIDTH} = Dimensions.get('window');

export class DeliveryMain extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Deliverys - CHML Mobile',
      //headerRight: (<BotonLogin nav = {navigation} />),
    };
  };

  render() {
    return (
        <View style = {styles.container}>
          <ScrollView>
        
            <Text style={styles.portadaText}>COMERCIOS CON DELIVERY{"\n"}CHML MOBILE</Text>
            
            <View style={styles.portadaImage}>
              <Image 
                source = {require('../assets/delivery_main.png')} 
                //imageStyle = {{resizeMode: 'contain'}}
                resizeMethod={'resize'}
                resizeMode={'contain'} 
              />
            </View>

        <View style={styles.container}>
        
        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('Delivery')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/delivery.png')}
          />
          <Text style={styles.buttonText}> 
            VER DELIVERYS
          </Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.button, styles.facebook]} onPress={() => this.props.navigation.navigate('RegistrarDelivery')}>
        <View style={styles.buttoncontent}>
          <Image style={styles.buttonImage}
            source={require('../assets/registrar_delivery.png')}
          />
          <Text style={styles.buttonText}> 
            REGISTRAR MI DELIVERY
          </Text>
        </View>
        </TouchableHighlight>

        </View>
        
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
    width: WIDTH * 0.9,
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
    width: WIDTH * 0.8, 
    height: 150,
    alignSelf: 'center',
  },
});