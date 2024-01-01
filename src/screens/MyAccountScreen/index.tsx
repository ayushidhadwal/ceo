import {
  View,
  Text,
  Pressable,
  TextInput,
  useWindowDimensions,
  I18nManager,
} from 'react-native';
import React, {useState} from 'react';
import I18n from '../../language/I18n';
import Colors from '../../constants/Colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  toggleSheet,
  toggleShowRegisterForm,
} from '../../store/slice/masterSlice';
import {ActivityIndicator} from 'react-native-paper';
import httpClient from '../../hooks/useHttp';
import {auth} from '../../store/slice/authSlice';
import AuthForm from '../AuthenticationScreens';
import {showToast} from '../../services/generalservices';
import i18n from '../../language/I18n';
import {VStack} from 'native-base';

const MyAccountScreen = () => {
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const {data}: any = useAppSelector(state => state?.auth);
  const [name, setName] = useState(data.user?.name);
  const [email, setEmail] = useState(data.user?.email);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [disabled, setDisabled] = useState(true);

  const updateHandler = async () => {
    if (name !== null && email !== null) {
      console.log({
        name: name,
        email: email,
      });
      setIsLoading(true);
      setEmailError('');
      setNameError('');

      httpClient
        .post('/update-profile', {
          name: name,
          email: email,
        })
        .then(res => {
          // if (res.data.data !== null) {
          if (res?.data.status === 'success') {
            showToast({msg: res?.data?.msg, color: 'green'});
            setTimeout(() => {
              dispatch(toggleSheet({}));
              dispatch(toggleShowRegisterForm(false));
              dispatch(auth({user: res.data.data.user, token: data.token}));
            }, 500);
          } else {
            if (res?.data?.msg) {
              showToast({msg: res?.data?.msg, color: 'red'});
            }

            if (res?.data?.Email) {
              setEmailError(res?.data?.Email);
            }

            if (res?.data?.Username) {
              setNameError(res?.data?.Username);
            }
          }
          // }
        })
        // .catch((error: any) => {
        //   showToast({msg: error?.message, color: 'red'});
        // })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return Object.keys(data).length !== 0 ? (
    <View>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Inter-Regular',
          fontWeight: '700',
          color: Colors.darkBlack,
          opacity: 0.8,
          fontSize: 20,
          lineHeight: 24.2,
          marginTop: 10,
        }}>
        {I18n.t('MyAccount')}
      </Text>
      <VStack style={{marginHorizontal: 16, marginBottom: 16}} space={1}>
        <View
          style={[
            {
              backgroundColor: Colors.lightGray,
              borderRadius: 10,
              height: 55,

              justifyContent: 'center',
            },
            {width: width - 32, marginTop: 20},
          ]}>
          <TextInput
            onChangeText={value => {
              setName(value);
              setDisabled(false);
            }}
            value={name}
            style={{
              marginLeft: 12,
            }}
            cursorColor={'#000'}
            selectionColor={'#000'}
            textAlign={I18nManager.isRTL ? 'right' : 'left'}
            placeholder={i18n.t('Enter Your Name')}
            placeholderTextColor={'#000000'}
          />
        </View>
        {nameError ? <Text style={{color: 'red'}}>{nameError}</Text> : null}
      </VStack>
      <VStack style={{marginHorizontal: 16, marginBottom: 16}} space={1}>
        <View
          style={[
            {
              backgroundColor: Colors.lightGray,
              borderRadius: 10,
              height: 55,

              justifyContent: 'center',
            },
            {width: width - 32, marginTop: 4},
          ]}>
          <TextInput
            onChangeText={value => {
              setEmail(value);
              setDisabled(false);
            }}
            // keyboardType="decimal-pad"
            value={email}
            style={{
              marginLeft: 12,
            }}
            textAlign={I18nManager.isRTL ? 'right' : 'left'}
            placeholder={i18n.t('Enter Your Email')}
            placeholderTextColor={'#000000'}
            cursorColor={'#000'}
            selectionColor={'#000'}
          />
        </View>
        {emailError ? <Text style={{color: 'red'}}>{emailError}</Text> : null}
      </VStack>

      <Pressable
        disabled={disabled}
        onPress={updateHandler}
        style={{
          height: 52,
          width: width - 32,
          backgroundColor: Colors.primaryGolden,
          opacity: disabled ? 0.5 : 1,
          borderRadius: 8,
          marginHorizontal: 16,
          marginVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {isLoading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text
            style={{
              textAlign: 'right',

              fontFamily: 'Inter-Regular',
              fontSize: 20,
              fontWeight: '500',
              lineHeight: 24.2,
              color: 'white',
            }}>
            {I18n.t('Update')}
          </Text>
        )}
      </Pressable>
    </View>
  ) : (
    <AuthForm fromPage={'MyAccount'}></AuthForm>
  );
};

export default MyAccountScreen;
