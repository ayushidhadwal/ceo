/**
 * @format
 */

const isAndroid = require('react-native').Platform.OS === 'android'; // this line is only needed if you don't use an .android.js file
const isHermesEnabled = !!global.HermesInternal;  // this line is only needed if you don't use an .android.js file

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import {

    enGB,
    registerTranslation,
} from 'react-native-paper-dates';
import { Provider } from 'react-redux';
import store, { presistore } from './src/store/index';

registerTranslation('en-GB', enGB);


const ReduxProvider = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <App />
            </NavigationContainer>

        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => ReduxProvider);

// AppRegistry.registerComponent(appName, () => App);