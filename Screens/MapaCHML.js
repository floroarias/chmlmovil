import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export class MapaCHML extends React.Component {
  static navigationOptions = {
    title: 'Mapa - CHML Mobile', 
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
          source={{ uri: "https://www.google.com/maps/d/u/0/viewer?mid=1Ra5g6iwjfNeSjSTjTVhOjwiFids&ll=-37.37971659827558%2C-70.27105387895966&z=14" }}
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