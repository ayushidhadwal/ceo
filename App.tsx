import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  LogBox,
  I18nManager,
  Text,
} from 'react-native';
import RootNavigation from './src/navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NativeBaseProvider, extendTheme} from 'native-base';

import SplashScreen from 'react-native-splash-screen';
// import LottieSplashScreen from "react-native-lottie-splash-screen";
import {Provider} from 'react-redux';
// import {store} from './src/store/redux/store';
import store, {presistore} from './src/store/index';
import {PersistGate} from 'redux-persist/integration/react';
import AppSplashScreen from './src/screens/SplashScreen';
import AuthForm from './src/screens/AuthenticationScreens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import moment from 'moment-timezone';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  LogBox.ignoreAllLogs();

  console.log(moment().tz());

  const config = {};

  const theme = extendTheme({
    fontConfig: {
      Inter: {
        100: {
          normal: 'Inter-Thin',
        },
        200: {
          normal: 'Inter-Light',
        },
        300: {
          normal: 'Inter-Light',
        },
        400: {
          normal: 'Inter-Regular',
        },
        500: {
          normal: 'Inter-Medium',
        },
        600: {
          normal: 'Inter-SemiBold',
        },
        700: {
          normal: 'Inter-Bold',
        },
        800: {
          normal: 'Inter-ExtraBold',
        },
        900: {
          normal: 'Inter-Black',
        },
      },
      Almarai: {
        300: {
          normal: 'Almarai-Light',
        },
        400: {
          normal: 'Almarai-Regular',
        },
        700: {
          normal: 'Almarai-Bold',
        },
        800: {
          normal: 'Almarai-ExtraBold',
        },
      },
    },
    fonts: {
      heading: I18nManager.isRTL ? 'Almarai' : 'Inter',
      body: I18nManager.isRTL ? 'Almarai' : 'Inter',
      mono: I18nManager.isRTL ? 'Almarai' : 'Inter',
      almarai: 'Almarai',
    },
    colors: {
      secondary: {
        100: '#E7C1AF',
      },

      primary: {
        50: '#C46537',
        100: '#C46537',
        200: '#C46537',
        300: '#C46537',
        400: '#C46537',
        500: '#C46537',
        600: '#C46537',
        700: '#C46537',
        800: '#C46537',
        900: '#C46537',
      },

      gray: {
        50: '#f5f5f5',
      },
    },
    components: {
      Checkbox: {
        baseStyle: {
          _checked: {
            borderColor: 'primary.200',
            bg: 'primary.100',
          },
        },
      },
      Radio: {
        baseStyle: {
          _icon: {
            color: 'primary.100',
          },
          _checked: {
            _interactionBox: {
              borderColor: 'primary.100',
            },
            borderColor: 'primary.200',
          },
        },
      },
      Modal: {
        baseStyle: {
          _backdrop: {
            opacity: '.65',
          },
        },
      },
      Divider: {
        baseStyle: {
          bg: '#F1F1F1',
        },
      },
    },
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NativeBaseProvider config={config} theme={theme}>
          {/*<SafeAreaView style={{flex: 1}}>*/}
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          {/* <Provider store={store}> */}
          <PersistGate loading={null} persistor={presistore}>
            <RootNavigation />

            {/* <AppSplashScreen></AppSplashScreen> */}
            {/* <Text>HEllooo</Text> */}
          </PersistGate>
          {/* </Provider> */}
          {/*</SafeAreaView>*/}
        </NativeBaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
