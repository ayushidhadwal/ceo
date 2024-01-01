import {
  View,
  Text,
  useWindowDimensions,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  I18nManager,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';
import CustomText from '../../constants/CustomText';
import BottomSheet from '@gorhom/bottom-sheet';
import Colors from '../../constants/Colors';
import {Actionsheet, useDisclose} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import I18n from '../../language/I18n';
import httpClient from '../../hooks/useHttp';
import {showToast} from '../../services/generalservices';
import PhoneInput from 'react-native-phone-number-input';
import {useAppSelector} from '../../store/hooks';
import i18n from 'i18n-js';

const useKeyboardBottomInset = () => {
  const [bottom, setBottom] = React.useState(0);
  const subscriptions = React.useRef([]);
  // console.log('data', data);

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

const SettingsScreen = ({navigation}: any) => {
  const bottomInset = useKeyboardBottomInset();
  const {width, height} = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(-1);

  const {data}: any = useAppSelector(state => state?.auth);

  const [query1, setQuery1] = useState(data?.user?.suffix_number);
  const [phoneNumber, setPhoneNumber] = useState(data?.user?.phone);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [otp, setOtp] = useState(null);
  const [startTimer, setStartTimer] = useState(false);
  // const [startPhase1Timer, setStartPhase1Timer] = React.useState(false);
  // const [phase1TimerId, setPhase1TimerId] = React.useState(0);
  const [otpTimer, setOtpTimer] = React.useState(59);
  const timerRef = useRef(null);
  const phoneInput = useRef<PhoneInput>(null);

  // 3 states  NUMBER PASSWORD VERIFY
  const [currentState, setCurrentState] = useState('');
  const [whiteList, setWhiteList] = useState([]);
  const {appData, allCountries} = useAppSelector(state => state?.master);

  const [defaultCountryCode, setDefaultCountryCode] = useState('KW');
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [245, 300, 320], []);

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const scrollToIndex = index => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    let temp = [];

    appData?.countries.forEach(country => {
      temp.push(country.country_code);
    });

    setWhiteList(temp);
  }, []);

  function handleTimer() {
    setStartTimer(true);
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => prev - 1);
    }, 1000);
  }

  const closeSheet = () => {
    // bottomSheetRef.current.close();
    setCurrentState('');
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (otpTimer === 0) {
      setStartTimer(false);
      clearInterval(timerRef.current);
      setOtpTimer(59);
    }
  }, [otpTimer]);

  const changePassHandler = async () => {
    setIsLoading(true);
    httpClient
      .post('/update-password', {
        new_password: password,
        confirm_password: confirmPass,
      })
      .then(res => {
        // console.log('resytre', res.data.data);
        if (res.data.data !== null) {
          if (res?.data.status === 'success') {
            showToast({msg: res?.data?.msg, color: 'green'});
            setTimeout(() => {
              onClose();
              setPassword('');
              setConfirmPass('');
            }, 500);
          } else {
            setIsLoading(false);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const uNumber = data?.user?.suffix_number;
  const uPhone = data?.user?.phone;

  useEffect(() => {
    setQuery1(uNumber);
    setPhoneNumber(uPhone);
  }, [uNumber, uPhone]);

  const changeNumberHandler = async () => {
    console.log(otp);
    if (!otp && currentState == 'VERIFY') {
      showToast({msg: I18n.t('Please Enter OTP'), color: 'red'});
      return;
    }
    // if (otp === '') {
    //   showToast({msg: I18n.t('Enter the Correct otp number'), color: 'red'});
    //   return;
    // }
    const data = {
      query1: query1,
      phone: phoneNumber,
      otp: otp,
    };

    if (otp) {
      data.otp = otp;
    }

    setIsLoading(true);
    httpClient
      .post('/change-number', data)
      .then(res => {
        // console.log('res', res.data);

        if (res.data.data !== null) {
          if (res?.data.status === 'success') {
            showToast({msg: res?.data?.msg, color: 'green'});
            if (otp) {
              setTimeout(() => {
                onClose();
                setPhoneNumber('');
                setOtp('');
                if (phoneInput.current?.state) {
                  phoneInput.current.state.code = phoneNumber
                    .replace(query1, '')
                    .replace('+', '');
                  phoneInput.current.state.number = query1;
                }
              }, 1000);
            }

            if (currentState !== 'VERIFY') {
              setCurrentState('VERIFY');
              handleTimer();
            }
          }

          setIsLoading(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const {isOpen, onOpen, onClose} = useDisclose();

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: currentIndex >= 0 ? '#000000' : 'white',
          opacity: currentIndex >= 0 ? 0.5 : 1,
        }}>
        {/* Button one */}
        <Pressable
          onPress={() => {
            // setCurrentIndex(0);
            setOtp('');
            onOpen();

            setCurrentState('NUMBER');
          }}
          style={{
            borderRadius: 8,
            backgroundColor: 'white',
            opacity: currentIndex >= 0 ? 0.2 : 1,
            elevation: currentIndex >= 0 ? 1 : 4,
            marginHorizontal: 16,
            marginTop: 28,
            marginBottom: 18,
            height: 55,
            width: width - 32,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            alignItems: 'center',
          }}>
          <Text style={[CustomText[50020], {color: '#000000'}]}>
            {I18n.t('ChangeNumber')}
          </Text>
          <Image
            source={require('../../assets/icons/chevronRight.png')}
            style={{
              width: 7,
              height: 14,
              transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
            }}
          />
        </Pressable>
        {/* Button two */}
        <Pressable
          onPress={() => {
            // setCurrentIndex(2);
            onOpen();
            setCurrentState('PASSWORD');
            setPassword('');
            setConfirmPass('');
          }}
          // onPress={onOpen}
          style={{
            borderRadius: 8,
            backgroundColor: 'white',
            opacity: currentIndex >= 0 ? 0.2 : 1,
            elevation: currentIndex >= 0 ? 1 : 4,
            marginHorizontal: 16,

            marginBottom: 18,
            height: 55,
            width: width - 32,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            alignItems: 'center',
          }}>
          <Text style={[CustomText[50020], {color: '#000000'}]}>
            {I18n.t('ChangePassword')}
          </Text>
          <Image
            source={require('../../assets/icons/chevronRight.png')}
            style={{
              width: 7,
              height: 14,
              transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
            }}
          />
        </Pressable>
      </View>

      <Actionsheet hideDragIndicator isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content bottom={bottomInset}>
          <View
            style={
              {
                // flex: 1,
              }
            }>
            {/* Sheet Views */}
            <View style={{width: '100%'}}>
              {/* title */}
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
                {I18n.t(
                  currentState == 'NUMBER'
                    ? 'ChangeNumber'
                    : currentState == 'PASSWORD'
                    ? 'ChangePassword'
                    : 'EnterVerificationCode',
                )}
              </Text>

              {/* title ends here */}
              {/*  Number Change Form */}
              {currentState == 'NUMBER' ? (
                <View>
                  <View
                    style={[
                      {
                        backgroundColor: '#F8F9F9',
                        borderRadius: 10,

                        marginHorizontal: 16,

                        marginTop: 20,
                      },
                    ]}>
                    <PhoneInput
                      textInputStyle={{
                        height: 55,
                      }}
                      ref={phoneInput}
                      defaultValue={query1}
                      defaultCode={defaultCountryCode}
                      placeholder={I18n.t('MobileNumber')}
                      textInputProps={{
                        placeholderTextColor: '#000000',
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                        fontWeight: '600',
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                      }}
                      containerStyle={{
                        backgroundColor: Colors.lightGray,
                        borderRadius: 10,
                        height: 55,
                        width: width - 64,
                      }}
                      layout="second"
                      onChangeText={pn => setQuery1(pn)}
                      onChangeFormattedText={pn => setPhoneNumber(pn)}
                    />
                  </View>
                </View>
              ) : null}
              {/*  Number Change Form Ends Here*/}

              {/*Change Password Form */}
              {currentState == 'PASSWORD' ? (
                <View>
                  <View>
                    {/* New Password */}
                    <View
                      style={[
                        {
                          backgroundColor: Colors.lightGray,
                          borderRadius: 10,
                          height: 55,

                          marginHorizontal: 16,
                          justifyContent: 'center',
                          marginBottom: 16,
                        },
                        {width: width - 32, marginTop: 20},
                      ]}>
                      <TextInput
                        cursorColor={'#000'}
                        selectionColor={'#000'}
                        onChangeText={setPassword}
                        // keyboardType="decimal-pad"
                        value={password}
                        style={{
                          marginLeft: 12,
                        }}
                        placeholder={I18n.t('NewPassword')}
                        textAlign={I18nManager.isRTL ? 'right' : 'left'}
                        placeholderTextColor={'#000000'}
                      />
                    </View>
                    {/* Confirm Password */}
                    <View
                      style={[
                        {
                          backgroundColor: Colors.lightGray,
                          borderRadius: 10,
                          height: 55,

                          marginHorizontal: 16,
                          justifyContent: 'center',
                          marginBottom: 16,
                        },
                        {width: width - 32},
                      ]}>
                      <TextInput
                        cursorColor={'#000'}
                        selectionColor={'#000'}
                        onChangeText={setConfirmPass}
                        // keyboardType="decimal-pad"
                        value={confirmPass}
                        style={{
                          marginLeft: 12,
                        }}
                        textAlign={I18nManager.isRTL ? 'right' : 'left'}
                        placeholder={I18n.t('ConfirmPassword')}
                        placeholderTextColor={'#000000'}
                      />
                    </View>
                  </View>
                </View>
              ) : null}
              {/* Change Password Form Ends Here*/}

              {/* verify form */}
              {/*  Number Change Form */}
              {currentState == 'VERIFY' ? (
                <View>
                  <View>
                    {/* otp */}
                    <View
                      style={[
                        {
                          backgroundColor: Colors.lightGray,
                          borderRadius: 10,
                          height: 55,

                          marginHorizontal: 16,
                          justifyContent: 'center',
                          marginBottom: 16,
                        },
                        {width: width - 32, marginTop: 20},
                      ]}>
                      <TextInput
                        cursorColor={'#000'}
                        selectionColor={'#000'}
                        onChangeText={setOtp}
                        keyboardType="decimal-pad"
                        value={otp}
                        style={{
                          marginLeft: 12,
                        }}
                        textAlign={I18nManager.isRTL ? 'right' : 'left'}
                        placeholder="OTP"
                        maxLength={4}
                        placeholderTextColor={'#000000'}
                      />
                    </View>
                  </View>
                  {/* Timer */}

                  <Text
                    style={{
                      textAlign: 'center',
                      // marginRight: 16,
                      marginTop: 12,
                      fontFamily: 'Inter-Regular',
                      fontSize: 16,
                      fontWeight: '400',
                      lineHeight: 19.36,
                      color: '#2e2e2e',
                    }}>
                    {otpTimer}s
                  </Text>
                  <Pressable
                    onPress={
                      !startTimer
                        ? () => {
                            changeNumberHandler();
                            handleTimer();
                          }
                        : null
                    }>
                    <Text
                      style={{
                        textAlign: 'center',
                        // marginRight: 16,
                        // marginTop: 28,
                        fontFamily: 'Inter-Regular',
                        fontSize: 16,
                        fontWeight: '400',
                        lineHeight: 19.36,
                        color: !startTimer ? '#2e2e2e' : '#c9c9c9',
                      }}>
                      {I18n.t('Resend')}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
              {/* verify form ends here */}

              {/* Submit Button */}
              <Pressable
                onPress={async () => {
                  if (currentState == 'NUMBER') {
                    changeNumberHandler();
                  }
                  if (currentState == 'PASSWORD') {
                    await changePassHandler();
                  }
                  if (currentState == 'VERIFY') {
                    await changeNumberHandler();
                  }
                }}
                style={{
                  height: 52,
                  width: width - 32,
                  backgroundColor: Colors.primaryGolden,
                  borderRadius: 8,
                  marginHorizontal: 16,
                  marginVertical: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {isLoading ? (
                  <ActivityIndicator color={'#ffffff'} />
                ) : (
                  <Text
                    style={{
                      textAlign: 'right',
                      fontFamily: 'Inter-Regular',
                      fontSize: 20,
                      fontWeight: '500',
                      lineHeight: 24.2,
                      color: '#ffffff',
                    }}>
                    {I18n.t(
                      currentState == 'NUMBER'
                        ? 'Change'
                        : currentState == 'PASSWORD'
                        ? 'Reset'
                        : 'Verify',
                    )}
                  </Text>
                )}
              </Pressable>
              {/* Submit Button Ends Here */}
            </View>
            {/* Sheet Views Ends here */}
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

export default SettingsScreen;
