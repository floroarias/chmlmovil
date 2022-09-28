import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export class Instagram extends React.Component {
  static navigationOptions = {
    title: 'Instagram - CHML Mobile', 
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
          source={{ uri: "https://www.instagram.com/chosmalalchml/" }}
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
