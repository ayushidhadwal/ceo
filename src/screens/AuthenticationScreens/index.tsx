import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  Image,
  Pressable,
  Button,
  ToastAndroid,
  I18nManager,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../../constants/Colors';
import styles from './style';

import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import I18n from '../../language/I18n';
import {
  toggleSheet,
  toggleShowRegisterForm,
} from '../../store/slice/masterSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import httpClient from '../../hooks/useHttp';
import {auth} from '../../store/slice/authSlice';
import {ActivityIndicator} from 'react-native-paper';
import {showToast} from '../../services/generalservices';
import PhoneInput from 'react-native-phone-number-input';
import {textInputAlign} from '../../utility/Languagehelper';
import {Input} from 'native-base';

const AuthForm = ({
  goToCheckoutDateTime,
  goToCheckoutPropertyDetails,
  fromPage, // office / meeting rooms
}: {
  scrollToIndex: ({index}: any) => void;
  closeSheet: () => void;
  currentIndex: any;
  fromPage: any;
  goToCheckoutDateTime: () => void;
  goToCheckoutPropertyDetails: () => void;
}) => {
  const formikRef = useRef<FormikProps<any>>(null);

  const width = useWindowDimensions().width;
  // input initial state
  const dispatch = useAppDispatch();
  const {isOpen} = useAppSelector(state => state?.master);
  const {initialFromValues} = useAppSelector(state => state?.master);
  const {appData, selectedCountry} = useAppSelector(state => state?.master);
  const [startTimer, setStartTimer] = useState(false);

  const [otpTimer, setOtpTimer] = useState(59);
  const timerRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  // Auth types LOGIN, REGISTER, VERIFY

  const {showRegisterForm} = useAppSelector(state => state?.master);

  const [authType, setAuthType] = useState(
    showRegisterForm ? 'REGISTER' : 'LOGIN',
  );

  //RESET SCREEN
  useEffect(() => {
    console.log('initial values is', initialFromValues);
    return () => {
      setAuthType('LOGIN');
    };
  }, []);

  function handleTimer() {
    setStartTimer(true);
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => prev - 1);
    }, 1000);
  }

  useEffect(() => {
    if (otpTimer === 0) {
      setStartTimer(false);
      clearInterval(timerRef.current);
      setOtpTimer(59);
    }
  }, [otpTimer]);

  const authenticationFormSchema = Yup.object().shape({
    name:
      authType == 'REGISTER'
        ? Yup.string()
            .min(2, I18n.t('Name is too short'))
            .max(60, I18n.t('Name is too long'))
            .required(I18n.t('Please enter full name'))
        : Yup.string().min(2, I18n.t('Too Short')).max(50, I18n.t('Too Long')),
    email:
      authType == 'REGISTER' || authType === 'FPASS'
        ? Yup.string()
            .email(I18n.t('Invalid email'))
            .required(I18n.t('Please enter email'))
        : Yup.string().email(I18n.t('Invalid email')),
    mobileNumber:
      authType == 'VERIFY' ||
      authType == 'LOGIN' ||
      authType === 'REGISTER' ||
      authType === 'FPASS'
        ? Yup.number()
            .typeError(I18n.t('Please enter mobile number'))
            .required(I18n.t('Please enter mobile number'))
        : Yup.number(),

    password:
      authType == 'VERIFY' || authType === 'FPASS'
        ? Yup.string()
        : Yup.string().required(I18n.t('Please enter your password')),
    otp:
      authType == 'VERIFY'
        ? Yup.string().required(I18n.t('Please enter OTP'))
        : Yup.string(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);

  const [whiteList, setWhiteList] = useState([]);

  useEffect(() => {
    let temp = [];

    appData?.countries.forEach(country => {
      temp.push(country.country_code);
    });

    setWhiteList(temp);
  }, []);

  const loginHandler = async (mobile, pass) => {
    setIsLoading(true);
    httpClient
      .post('/login', {
        phone: mobile,
        password: pass,
      })
      .then(res => {
        if (res.data.data) {
          if (res?.data.status === 'success') {
            showToast({msg: res?.data?.msg, color: 'green'});

            setTimeout(() => {
              dispatch(auth(res?.data?.data));
              dispatch(toggleSheet({}));
              dispatch(toggleShowRegisterForm(false));
            }, 500);
          }

          if (fromPage === 'PropertyDetails') {
            goToCheckoutPropertyDetails();
          } else if (fromPage === 'DateTime') {
            goToCheckoutDateTime();
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signUpHandler = async (name, email, mobileFormatted, pass, mobile) => {
    setIsLoading(true);
    httpClient
      .post('/register', {
        name: name,
        email: email,
        phone: mobileFormatted,
        password: pass,
        query1: mobile,
      })
      .then(res => {
        if (res?.data.status === 'success') {
          console.log(res?.data?.msg);

          showToast({msg: res?.data?.msg, color: 'green'});
        }

        if (res.data.data) {
          setIsLoading(false);
          setAuthType('VERIFY');
          handleTimer();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const otpVerifyHandler = async (otp, mobile) => {
    setIsLoading(true);
    httpClient
      .post('/verify', {
        otp: otp,
        phone: mobile,
      })
      .then(res => {
        console.log('res', res);

        if (res.data.data) {
          dispatch(auth(res.data.data));
          dispatch(toggleSheet({}));
          dispatch(toggleShowRegisterForm(false));
          if (res?.data.status === 'success') {
            showToast({msg: res?.data?.msg, color: 'green'});
          }

          if (fromPage === 'PropertyDetails') {
            goToCheckoutDateTime();
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const forgotPassHandler = async (email, mobile) => {
    setIsLoading(true);
    httpClient
      .post('/forgot-password', {
        email: email,
        mobile: mobile,
      })
      .then(res => {
        if (res) {
          setAuthType('LOGIN');
          if (res?.data.status === 'success') {
            showToast({msg: res?.data?.msg, color: 'green'});
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resetForm = () => {
    formikRef.current?.resetForm();
    phoneInput.current?.setState({number: ''});
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text
          style={{
            textAlign: 'center',

            fontFamily: 'Inter-Regular',

            fontWeight: '700',

            color: Colors.darkBlack,

            opacity: 0.8,

            fontSize: 20,

            lineHeight: 24.2,
          }}>
          {I18n.t(
            authType == 'LOGIN'
              ? 'Login'
              : authType == 'REGISTER'
              ? 'Register'
              : authType == 'FPASS'
              ? 'Forgot Password'
              : 'EnterVerificationCode',
          )}
        </Text>
      </View>

      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initialFromValues}
        onSubmit={async (values, {resetForm}) => {
          Keyboard.dismiss();

          if (authType == 'LOGIN') {
            loginHandler(values.mobileNumber, values.password);
          } else if (authType == 'REGISTER') {
            signUpHandler(
              values.name,

              values.email,

              values.mobileNumber,

              values.password,

              values.query,
            );
          } else if (authType == 'VERIFY') {
            otpVerifyHandler(values.otp, values.mobileNumber);
          } else if (authType === 'FPASS') {
            await forgotPassHandler(values.email, values.mobileNumber);

            resetForm();
          }
        }}
        validationSchema={authenticationFormSchema}>
        {({
          handleChange,

          handleBlur,

          handleSubmit,

          handleReset,

          values,

          errors,

          touched,
        }) => (
          <View>
            {authType == 'LOGIN' || authType == 'REGISTER' ? (
              // {/* Auth Form */}

              <View>
                {/* Register */}

                {authType == 'REGISTER' ? (
                  <View>
                    {/* Full Name */}

                    <View
                      style={[
                        styles.textInputContainer,

                        {width: width - 32, marginTop: 20},
                      ]}>
                      <TextInput
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        style={{
                          marginLeft: 12,

                          textAlign: I18nManager.isRTL ? 'right' : 'left',
                        }}
                        cursorColor={'#000'}
                        selectionColor={'#000'}
                        placeholder={I18n.t('FullName')}
                        placeholderTextColor={'#000000'}
                        textAlign={textInputAlign()}
                      />
                    </View>

                    {errors.name && touched.name ? (
                      <Text
                        style={{
                          color: 'red',

                          marginLeft: 16,

                          marginTop: 2,

                          marginBottom: 16,

                          textAlign: 'left',
                        }}>
                        {errors.name}
                      </Text>
                    ) : (
                      <View style={{marginBottom: 16}} />
                    )}

                    {/* Full Name Ends Here */}

                    {/* email */}

                    <View
                      style={[styles.textInputContainer, {width: width - 32}]}>
                      <TextInput
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        cursorColor={'#000'}
                        selectionColor={'#000'}
                        style={{
                          marginLeft: 12,
                          textAlign: I18nManager.isRTL ? 'right' : 'left',
                        }}
                        placeholder={I18n.t('EmailAddress')}
                        placeholderTextColor={'#000000'}
                        keyboardType="email-address"
                        textAlign={textInputAlign()}
                      />
                    </View>

                    {errors.email && touched.email ? (
                      <Text
                        style={{
                          color: 'red',

                          marginLeft: 16,

                          marginTop: 2,

                          marginBottom: 16,

                          textAlign: 'left',
                        }}>
                        {errors.email}
                      </Text>
                    ) : (
                      <View style={{marginBottom: 16}} />
                    )}

                    {/* Email Ends Here */}
                  </View>
                ) : null}

                {/* Registr Ends Here */}

                {/* Login */}

                <View>
                  <View>
                    {/* Mobile Number */}

                    <View
                      style={[
                        {
                          backgroundColor: '#F8F9F9',

                          borderRadius: 10,

                          marginHorizontal: 16,

                          width: width - 32,

                          marginTop: authType == 'LOGIN' ? 20 : 0,
                        },
                      ]}>
                      <PhoneInput
                        textInputStyle={{
                          height: 55,
                        }}
                        ref={phoneInput}
                        defaultValue={values.mobileNumber}
                        defaultCode="KW"
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
                        onChangeText={handleChange('query')}
                        onChangeFormattedText={handleChange('mobileNumber')}
                      />
                    </View>

                    {/* Mobile Number Ends Here */}

                    {errors.mobileNumber && touched.mobileNumber ? (
                      <Text
                        style={{
                          color: 'red',

                          marginLeft: 16,

                          marginTop: 2,

                          marginBottom: 16,

                          textAlign: 'left',
                        }}>
                        {errors.mobileNumber}
                      </Text>
                    ) : (
                      <View style={{marginBottom: 16}} />
                    )}

                    {/* Password */}

                    <View
                      style={[styles.textInputContainer, {width: width - 32}]}>
                      <View
                        style={{
                          flexDirection: 'row',

                          alignItems: 'center',

                          justifyContent: 'space-between',

                          marginRight: 16,
                        }}>
                        <TextInput
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                          style={{
                            marginLeft: 12,

                            marginRight: 4,

                            textAlign: I18nManager.isRTL ? 'right' : 'left',

                            flex: 1,
                          }}
                          cursorColor={'#000'}
                          selectionColor={'#000'}
                          placeholder={I18n.t('Password')}
                          placeholderTextColor={'#000000'}
                          secureTextEntry={!showPassword}
                          textAlign={textInputAlign()}
                        />

                        <Pressable
                          onPress={() => {
                            setShowPassword(!showPassword);
                          }}>
                          <Image
                            source={
                              showPassword
                                ? require('../../assets/icons/eye.png')
                                : require('../../assets/icons/close-eye.png')
                            }
                            style={{
                              height: 15,

                              width: 20,
                            }}
                          />
                        </Pressable>
                      </View>
                    </View>

                    {errors.password && touched.password ? (
                      <Text
                        style={{
                          color: 'red',

                          marginLeft: 16,

                          marginTop: 2,

                          // marginBottom: 16,

                          textAlign: 'left',
                        }}>
                        {errors.password}
                      </Text>
                    ) : (
                      <View style={{marginBottom: 0}} />
                    )}

                    {/* Password Ends Here */}

                    {/* Forgot Password Text */}

                    {authType == 'LOGIN' ? (
                      <Pressable
                        style={{
                          alignSelf: 'flex-end',
                        }}
                        onPress={() => {
                          handleReset();
                          setAuthType('FPASS');
                        }}>
                        <Text
                          style={{
                            textAlign: I18nManager.isRTL ? 'left' : 'right',

                            paddingHorizontal: 16,

                            marginTop: 16,

                            fontFamily: 'Inter-Regular',

                            fontSize: 16,

                            fontWeight: '600',

                            lineHeight: 19.36,

                            color: Colors.black,

                            // marginTop:16
                          }}>
                          {I18n.t('ForgotPassword')}
                        </Text>
                      </Pressable>
                    ) : null}

                    {/* Footer Text and Link */}

                    <Pressable
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        resetForm();

                        if (authType == 'LOGIN') {
                          setAuthType('REGISTER');

                          // scrollToIndex(2); // scroll to "85%" of screen
                        } else {
                          setAuthType('LOGIN');

                          // scrollToIndex(1); // scroll to "60%" of screen
                        }
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',

                          marginRight: 16,

                          marginTop: 28,

                          fontFamily: 'Inter-Regular',

                          fontSize: 16,

                          fontWeight: '400',

                          lineHeight: 19,

                          color: '#2e2e2e',

                          opacity: 0.8,
                        }}>
                        {I18n.t(
                          authType == 'LOGIN'
                            ? `DontHaveAccount`
                            : `AlreadyHaveAccount`,
                        )}

                        <Text
                          style={{
                            textAlign: 'center',

                            marginRight: 16,

                            marginTop: 28,

                            fontFamily: 'Inter-Regular',

                            fontSize: 16,

                            fontWeight: '700',

                            lineHeight: 19,

                            color: '#2e2e2e',
                          }}>
                          {` ${I18n.t(
                            authType == 'LOGIN' ? `SignUp` : `SignIn`,
                          )}`}
                        </Text>
                      </Text>
                    </Pressable>

                    {/* Footer Text and Link Ends Here */}
                  </View>
                </View>

                {/* LoginEnds Here */}
              </View>
            ) : authType == 'FPASS' ? (
              <View style={{marginTop: 16}}>
                {/* email */}

                <View style={[styles.textInputContainer, {width: width - 32}]}>
                  <TextInput
                    cursorColor={'#000'}
                    selectionColor={'#000'}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    style={{
                      marginLeft: 12,

                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    placeholder={I18n.t('EmailAddress')}
                    placeholderTextColor={'#000000'}
                    textAlign={textInputAlign()}
                  />
                </View>

                {errors.email && touched.email ? (
                  <Text
                    style={{
                      color: 'red',

                      marginLeft: 16,

                      marginTop: 2,

                      marginBottom: 16,

                      textAlign: 'left',
                    }}>
                    {errors.email}
                  </Text>
                ) : (
                  <View style={{marginBottom: 16}} />
                )}

                {/* Email Ends Here */}

                {/* Mobile Number */}

                <View
                  style={[
                    // styles.textInputContainer,

                    {
                      backgroundColor: '#F8F9F9',

                      borderRadius: 10,

                      // height: 55,

                      marginHorizontal: 16,

                      // justifyContent: 'center',

                      width: width - 32,

                      // marginTop: authType == 'LOGIN' ? 20 : 0,
                    },
                  ]}>
                  <PhoneInput
                    textInputStyle={{
                      height: 55,
                    }}
                    ref={phoneInput}
                    defaultValue={values.mobileNumber}
                    defaultCode="KW"
                    placeholder={I18n.t('MobileNumber')}
                    // placeholderTextColor={'#000000'}

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

                      // marginHorizontal: 16,
                    }}
                    layout="second"
                    // onChangeText={handleChange('mobileNumber')}

                    onChangeFormattedText={handleChange('mobileNumber')}
                  />
                </View>

                {/* Mobile Number Ends Here */}

                {errors.mobileNumber && touched.mobileNumber ? (
                  <Text
                    style={{
                      color: 'red',

                      marginLeft: 16,

                      marginTop: 2,

                      marginBottom: 16,

                      textAlign: 'left',
                    }}>
                    {errors.mobileNumber}
                  </Text>
                ) : (
                  <View style={{marginBottom: 16}} />
                )}
              </View>
            ) : (
              // {/* Auth Form Ends Here */}

              //  Verification form

              <View>
                {/* OTP */}

                <View
                  style={[
                    styles.textInputContainer,

                    {width: width - 32, marginTop: 20},
                  ]}>
                  <TextInput
                    cursorColor={'#000'}
                    selectionColor={'#000'}
                    onChangeText={handleChange('otp')}
                    onBlur={handleBlur('otp')}
                    value={values.otp}
                    keyboardType="decimal-pad"
                    style={{
                      marginLeft: 12,
                    }}
                    maxLength={4}
                    placeholder="OTP"
                    placeholderTextColor={'#000000'}
                    textAlign={textInputAlign()}
                  />
                </View>
                <Text
                  style={{
                    color: 'red',

                    marginLeft: 16,

                    marginTop: 2,

                    marginBottom: 16,

                    textAlign: 'left',
                  }}>
                  {errors.otp}
                </Text>

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
                          signUpHandler(
                            values.name,

                            values.email,

                            values.mobileNumber,

                            values.password,

                            values.query,
                          );

                          // setOtpTimer(59);

                          // setStartPhase1Timer(true);
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

              // Verification Form Ends Here
            )}

            {/* Submit Button */}

            <Pressable
              onPress={isLoading ? null : handleSubmit}
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
                <ActivityIndicator color="white" />
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
                  {I18n.t(
                    authType == 'LOGIN'
                      ? 'Login'
                      : authType == 'REGISTER'
                      ? 'Register'
                      : authType == 'FPASS'
                      ? 'Get Password'
                      : 'Verify',
                  )}
                </Text>
              )}
            </Pressable>

            {/* Submit Button Ends Here */}
          </View>
        )}
      </Formik>

      {authType == 'FPASS' ? (
        <Pressable
          style={{position: 'absolute', left: 14, top: 2, zIndex: 7}}
          onPress={() => {
            // navigation.goBack();
            resetForm();

            setAuthType('LOGIN');
          }}>
          <Image
            style={[
              styles.backButton,

              {
                transform: [
                  {
                    scaleX: I18nManager.isRTL ? -1 : 1,
                  },
                ],
              },
            ]}
            source={require('../../assets/icons/Home/BackButton.png')}
          />
        </Pressable>
      ) : null}

      {/* /////////////////////////////////////////////////////////////////////////// */}
    </View>
  );
};

export default AuthForm;
