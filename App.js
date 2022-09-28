//import Animated, {
//  useSharedValue,
//  withTiming,
//  useAnimatedStyle,
//  Easing,
//} from 'react-native-reanimated';

import 'react-native-gesture-handler'; //Requisito para React Navigation 5.
import React from "react";
import {createStackNavigator} from '@react-navigation/stack'; //Barra de Navegación. Version 5.
//import {createAppContainer} from 'react-navigation'; //Barra de Navegación. Obsoleta desde Versión 5.
import { NavigationContainer } from '@react-navigation/native'; //Nueva en Versión 5
import {createStore, applyMiddleware} from 'redux'; //Mantiene un estado 'global' de la app.
import {Provider} from 'react-redux'; //Enlaza el state de redux con RN.
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers'; //Manejadores de cambios de estado.
//import { initialState } from './redux/initialState';
//import logger from 'redux-logger'; //Herramienta de depuración.
//Persistencia del state de redux.
//import {persistStore, persistReducer} from 'redux-persist'
//import storage from 'redux-persist/lib/storage' //Defaults to localStorage for web and AsyncStorage for react-native
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistGate } from 'redux-persist/integration/react';

//Importo todas las pantallas para configurar el navigator.
import Impuestos from "./Screens/Impuestos";
import {Home} from "./Screens/Home";
import {Facebook} from "./Screens/Facebook";
import {Instagram} from "./Screens/Instagram";
import {Twitter} from "./Screens/Twitter";
import {Noticias} from "./Screens/Noticias";
import {DeliveryMain} from "./Screens/DeliveryMain";
import {Delivery} from "./Screens/Delivery";
import {RegistrarDelivery} from "./Screens/RegistrarDelivery";
import {Novedades} from "./Screens/Novedades";
import {MapaCHML} from "./Screens/MapaCHML";
import Login from "./Screens/Login";
import Identificarse from "./Screens/Identificarse";
import Registrarse from "./Screens/Registrarse";
import DetalleImpuesto from "./Screens/DetalleImpuesto";
import Denuncias from "./Screens/Denuncias";
import NuevaDenunciaDetalle from "./Screens/NuevaDenunciaDetalle";
import MisDenuncias from "./Screens/MisDenuncias";
import AdminTodasLasDenuncias from "./Screens/AdminTodasLasDenuncias";
import TodasLasDenunciasPublicas from "./Screens/TodasLasDenunciasPublicas";
import PoliticaPrivacidad from "./Screens/PoliticaPrivacidad";
import Administracion from "./Screens/Administracion";
import OlvidoPassword from "./Screens/OlvidoPassword";
import CambioPassword from "./Screens/CambioPassword";
import AdministracionDenuncias from "./Screens/AdministracionDenuncias";
import DetalleDenunciaAdmin from "./Screens/DetalleDenunciaAdmin";
import AdministracionNovedades from "./Screens/AdministracionNovedades";
import DetalleNovedadAdmin from "./Screens/DetalleNovedadAdmin";
import AdministracionDeliverys from "./Screens/AdministracionDeliverys";
import DetalleNuevoDelivery from "./Screens/DetalleNuevoDelivery";
import AdministracionUsuarios from "./Screens/AdministracionUsuarios";
import DetalleUsuarioAdmin from "./Screens/DetalleUsuarioAdmin";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

//Creo el store para mantener el estado global.
let store = createStore(
  persistedReducer,
  //initialState, 
  applyMiddleware(thunk),
);

const  persistor = persistStore(store)

const Stack = createStackNavigator(); //Creo la barra de navegación.

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          //backgroundColor: '#f4511e',
          backgroundColor: '#002b58',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={Home.navigationOptions}
      />
      <Stack.Screen
        name="DeliveryMain"
        component={DeliveryMain}
        options={DeliveryMain.navigationOptions}
      />
      <Stack.Screen
        name="Delivery"
        component={Delivery}
        options={Delivery.navigationOptions}
      />
      <Stack.Screen
        name="RegistrarDelivery"
        component={RegistrarDelivery}
        options={RegistrarDelivery.navigationOptions}
      />
      <Stack.Screen
        name="Impuestos"
        component={Impuestos}
        options={Impuestos.navigationOptions}
      />
      <Stack.Screen
        name="Denuncias"
        component={Denuncias}
        options={Denuncias.navigationOptions}
      />
      <Stack.Screen
        name="NuevaDenunciaDetalle"
        component={NuevaDenunciaDetalle}
        options={NuevaDenunciaDetalle.navigationOptions}
      />
      <Stack.Screen
        name="MisDenuncias"
        component={MisDenuncias}
        options={MisDenuncias.navigationOptions}
      />
      <Stack.Screen
        name="AdminTodasLasDenuncias"
        component={AdminTodasLasDenuncias}
        options={AdminTodasLasDenuncias.navigationOptions}
      />
      <Stack.Screen
        name="TodasLasDenunciasPublicas"
        component={TodasLasDenunciasPublicas}
        options={TodasLasDenunciasPublicas.navigationOptions}
      />
      <Stack.Screen
        name="Identificarse"
        component={Identificarse}
        options={Identificarse.navigationOptions}
      />
      <Stack.Screen
        name="Novedades"
        component={Novedades}
        options={Novedades.navigationOptions}
      />
      <Stack.Screen
        name="MapaCHML"
        component={MapaCHML}
        options={MapaCHML.navigationOptions}
      />
      <Stack.Screen
        name="Facebook"
        component={Facebook}
        options={Facebook.navigationOptions}
      />
      <Stack.Screen
        name="Instagram"
        component={Instagram}
        options={Instagram.navigationOptions}
      />
      <Stack.Screen
        name="Twitter"
        component={Twitter}
        options={Twitter.navigationOptions}
      />
      <Stack.Screen
        name="Noticias"
        component={Noticias}
        options={Noticias.navigationOptions}
      />
      <Stack.Screen
        name="Registrarse"
        component={Registrarse}
        options={Registrarse.navigationOptions}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={Login.navigationOptions}
      />
      <Stack.Screen
        name="DetalleImpuesto"
        component={DetalleImpuesto}
        options={DetalleImpuesto.navigationOptions}
      />
      <Stack.Screen
        name="PoliticaPrivacidad"
        component={PoliticaPrivacidad}
        options={PoliticaPrivacidad.navigationOptions}
      />
      <Stack.Screen
        name="Administracion"
        component={Administracion}
        options={Administracion.navigationOptions}
      />
      <Stack.Screen
        name="OlvidoPassword"
        component={OlvidoPassword}
        options={OlvidoPassword.navigationOptions}
      />
      <Stack.Screen
        name="CambioPassword"
        component={CambioPassword}
        options={CambioPassword.navigationOptions}
      />
      <Stack.Screen
        name="AdministracionDenuncias"
        component={AdministracionDenuncias}
        options={AdministracionDenuncias.navigationOptions}
      />
      <Stack.Screen
        name="DetalleDenunciaAdmin"
        component={DetalleDenunciaAdmin}
        options={DetalleDenunciaAdmin.navigationOptions}
      />
      <Stack.Screen
        name="AdministracionNovedades"
        component={AdministracionNovedades}
        options={AdministracionNovedades.navigationOptions}
      />
      <Stack.Screen
        name="DetalleNovedadAdmin"
        component={DetalleNovedadAdmin}
        options={DetalleNovedadAdmin.navigationOptions}
      />
      <Stack.Screen
        name="AdministracionDeliverys"
        component={AdministracionDeliverys}
        options={AdministracionDeliverys.navigationOptions}
      />
      <Stack.Screen
        name="DetalleNuevoDelivery"
        component={DetalleNuevoDelivery}
        options={DetalleNuevoDelivery.navigationOptions}
      />
      <Stack.Screen
        name="AdministracionUsuarios"
        component={AdministracionUsuarios}
        options={AdministracionUsuarios.navigationOptions}
      />
      <Stack.Screen
        name="DetalleUsuarioAdmin"
        component={DetalleUsuarioAdmin}
        options={DetalleUsuarioAdmin.navigationOptions}
      />
    </Stack.Navigator>
  );
}

//const AppContainer = createAppContainer(AppNavigator); //Obsoleto para v5 del navigator.

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          {RootStack()}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App