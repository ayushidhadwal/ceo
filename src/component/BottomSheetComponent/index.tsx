import {
  View,
  Text,
  Pressable,
  TextInput,
  useWindowDimensions,
  Keyboard,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Actionsheet} from 'native-base';
import I18n from '../../language/I18n';
import Colors from '../../constants/Colors';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {
  toggleSheet,
  toggleShowRegisterForm,
} from '../../store/slice/masterSlice';
import RBSheet from 'react-native-raw-bottom-sheet';

import AuthForm from '../../screens/AuthenticationScreens';

const useKeyboardBottomInset = () => {
  const [bottom, setBottom] = React.useState(0);
  const subscriptions = React.useRef([]);

  React.useEffect(() => {
    subscriptions.current = [
      Keyboard.addListener('keyboardDidHide', e => setBottom(0)),
      Keyboard.addListener('keyboardDidShow', e => {
        if (Platform.OS === 'android') {
          setBottom(e.endCoordinates.height);
        } else {
          setBottom(
            Math.max(e.startCoordinates.height, e.endCoordinates.height),
          );
        }
      }),
    ];

    return () => {
      subscriptions.current.forEach(subscription => {
        subscription.remove();
      });
    };
  }, [setBottom, subscriptions]);

  return bottom;
};
const BottomSheetComponent = ({children}: any) => {
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const dispatch = useAppDispatch();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@gmail.com');
  const refRBSheet = useRef();
  const bottomInset = useKeyboardBottomInset();

  const {isOpen} = useAppSelector(state => state?.master);
  const open = () => {
    refRBSheet?.current?.open();
  };
  useEffect(() => {
    if (isOpen) {
      open();
    } else {
      refRBSheet?.current?.close();
    }
  }, [isOpen]);
  const [contentHeight, setContentHeight] = useState(0);
  const handleContentLayout = event => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };
  return (
    <Actionsheet
      hideDragIndicator
      isOpen={isOpen}
      onClose={() => {
        console.log('on close called!!!!!!!!!');
        dispatch(toggleSheet({}));
        dispatch(toggleShowRegisterForm(false));
      }}>
      <Actionsheet.Content bottom={bottomInset}>{children}</Actionsheet.Content>
    </Actionsheet>

    // <RBSheet
    //   animationType="none"
    //   ref={refRBSheet}
    //   height={contentHeight}
    //   // height={property?.is_timeslotes_available ? 650 : 350}

    //   openDuration={250}
    //   customStyles={{
    //     container: {
    //       // height: 600,

    //       borderRadius: 12,
    //     },
    //   }}>
    //   <View onLayout={handleContentLayout}>{children}</View>
    // </RBSheet>
  );
};

export default BottomSheetComponent;
