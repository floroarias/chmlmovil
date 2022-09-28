import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export class Noticias extends React.Component {
  static navigationOptions = {
    title: 'Web - CHML Mobile', 
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
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={this.ActivityIndicatorLoadingView}
          source={{ uri: "http://www.chosmalal.gob.ar/" }}
        />
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
});
