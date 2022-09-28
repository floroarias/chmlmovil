import React from 'react';
import { StyleSheet, ActivityIndicator, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
const {width: WIDTH} = Dimensions.get('window');

export class Facebook extends React.Component {
  static navigationOptions = {
    title: 'Facebook - CHML Mobile', 
  };

  ActivityIndicatorLoadingView() {
    //Esto es lo que se va a mostrar mientras se carga la webview.
    return (
      <ActivityIndicator
        color="#009688"
        size="large"
      />
    );
  }

  render() {
    return (
        <WebView
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={this.ActivityIndicatorLoadingView}
          //width={WIDTH}
          /* Agregar styles.container para el siguiente link. */
          //source={{ uri: "https://es-la.facebook.com/CHMLChosMalal/" }}
          //source={{ uri: "https://www.facebook.com/plugins/page.php?href=https//es-la.facebook.com/CHMLChosMalal" }}
          //source={{ uri: "https://www.facebook.com/plugins/page.php?href=https//es-la.facebook.com/CHMLChosMalal&tabs=timeline&small_header=true&show_facepile=false" }}
          source={{ uri: "https://www.facebook.com/plugins/page.php?href=https//es-la.facebook.com/CHMLChosMalal&tabs=timeline&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false" }}
          style={styles.container}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    flex: 1,
    //flexWrap: 'wrap',
    //flexDirection: 'row',
    backgroundColor: 'lightskyblue',
    alignItems: 'center',
    justifyContent: 'center',
    //alignContent: 'stretch',
    margin: 0,
  },
});