import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {
  Box,
  Button,
  FormControl,
  HStack,
  Image,
  Input,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import {showToast} from '../../services/generalservices';
import {ProgressBar} from '../../component/ProgressBar';
import httpClient from '../../hooks/useHttp';
import {Dropdown} from 'react-native-element-dropdown';
import {useInit} from '../../hooks/useInit';
import i18n from '../../language/I18n';
import I18n from 'i18n-js';
import {textInputAlign} from '../../utility/Languagehelper';
import Loader from '../../utility/Loader';
import validator from 'validator';

const WIDTH = Dimensions.get('screen').width;

const TrainerDetailsScreen = (navigation: any) => {
  const {genderType, dataLoading} = useInit();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [otpNumber, setOtpNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [country, setCountry] = useState('');
  const [countryId, setCountryId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signature, setSignature] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [address, setAddress] = useState('');
  const [civilId, setCivilId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);

  const [otpLoader, setOtpLoader] = useState(false);
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [otpTimer, setOtpTimer] = useState(59);

  const timerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.navigation.addListener('focus', () => {
      if (navigation.route.params !== undefined) {
        if (navigation.route.params.countryName) {
          setCountryId(String(navigation.route.params.countryId));
          setCountry(String(navigation.route.params.countryName));
          setPhoneCode(String(navigation.route.params.phoneCode));
        } else if (navigation.route.params.sign) {
          setSignature(String(navigation.route.params.sign));
        }
      }
    });
    return unsubscribe;
  }, [navigation.navigation, navigation.route]);

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

  const onNumberHandler = async () => {
    if (otpNumber === '') {
      showToast({msg: i18n.t('Please Enter Phone Number'), color: 'red'});
      return;
    }
    setOtpLoader(true);
    setQuery(otpNumber);
    httpClient
      .post('number-verify', {
        phone: `${phoneCode}${otpNumber}`,
      })
      .then((response: any) => {
        if (response.data.status === 'success') {
          showToast({msg: response?.data?.msg, color: 'green'});
          setShow(false);
          setVisible(true);
          handleTimer();
        } else {
          showToast({msg: response?.data?.msg, color: 'red'});
        }
        setOtpLoader(false);
      })
      .catch((error: any) => {
        showToast({msg: error?.message, color: 'red'});

        setOtpLoader(false);
      });
  };

  console.log(`${value} ${representativeName}`);

  const onSubmitHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', representativeName);
    formData.append('email', email);
    formData.append('country_id', countryId);
    formData.append('vender', '2');
    formData.append('mobile', otpNumber);
    formData.append('query1', otpNumber);
    formData.append('representative_name', `${value} ${representativeName}`);
    formData.append('address', address);
    formData.append('civil_id', civilId);

    formData.append('signature', {
      uri: `file://${signature}`,
      name: 'signature.pdf',
      type: 'image/png',
    });

    httpClient
      .post('/vendor-register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response: any) => {
        // console.log(response);
        if (response.data.status === 'success') {
          // console.log('response.data', response.data);
          showToast({
            msg: i18n.t('Your request has been Submitted'),
            color: 'green',
          });
          navigation.navigation.navigate('HomeScreen');
        }
        setLoading(false);
      })
      .catch((error: any) => {
        showToast({msg: error?.message, color: 'red'});
        setLoading(false);
      });
  };

  const onOtpHandler = async () => {
    if (otp === '') {
      showToast({msg: i18n.t('Please Enter OTP'), color: 'red'});
      return;
    }
    setVerifyLoader(true);
    httpClient
      .post('otp-verify', {
        phone: `${phoneCode}${otpNumber}`,
        otp: otp,
      })
      .then((response: any) => {
        console.log('response1', response);

        if (response.data.status === 'success') {
          showToast({msg: response?.data?.msg, color: 'green'});
          setVisible(false);
          setOtp('');
          setOtpNumber('');
          onSubmitHandler();
        } else {
          showToast({msg: response?.data?.msg, color: 'red'});
        }

        setVerifyLoader(false);
      })
      .catch((error: any) => {
        showToast({msg: error?.message, color: 'red'});
      });
  };

  const validateCheck = async () => {
    const response = await httpClient.post('verify-details', {
      type: 1,
      value: email,
    });
    if (!response?.data?.data?.is_avaiable) {
      showToast({msg: i18n.t('Email must be unique'), color: 'red'});
      return;
    }

    if (
      representativeName === '' ||
      !email ||
      countryId === '' ||
      address === '' ||
      !value ||
      signature === ''
    ) {
      showToast({msg: i18n.t('All the fields are required'), color: 'red'});
    } else {
      if (!validator.isEmail(email)) {
        showToast({msg: i18n.t('Email is invalid!'), color: 'red'});
      } else {
        setShow(true);
      }
    }
  };

  // useEffect(() => {
  //   if (email) {
  //     httpClient
  //       .post('verify-details', {
  //         type: 1,
  //         value: email,
  //       })
  //       .then((response: any) => {
  //         // console.log('response', response);
  //
  //         setIsAvailable(response.data.data.is_avaiable);
  //       });
  //   }
  // }, [email]);

  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <ProgressBar value={4} />
        <VStack>
          <HStack
            alignItems={'center'}
            w={'94%'}
            alignSelf={'center'}
            justifyContent={'space-between'}>
            <Dropdown
              itemTextStyle={{
                fontSize: 14,
                color: 'black',
              }}
              renderRightIcon={() => (
                <Image
                  source={require('../../assets/arrow-down-sign-to-navigate.png')}
                  h={3}
                  w={3}
                  resizeMode={'contain'}
                  alt={'no img'}
                  mx={2}
                />
              )}
              style={{
                width: '30%',
                alignSelf: 'center',
                marginTop: 12,
                borderRadius: 5,
                backgroundColor: '#e5e5e5',
                height: 48,
              }}
              placeholderStyle={{
                fontSize: 14,
                color: 'black',
                marginLeft: 11,
              }}
              selectedTextStyle={{
                fontSize: 15,
                color: 'black',
                marginLeft: 11,
              }}
              data={genderType.map(f => ({
                label: f.name_en,
                value: f.name_en,
              }))}
              search={false}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={i18n.t('Select')}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
            />
            <Input
              w={'68%'}
              height={12}
              alignSelf={'center'}
              shadow={3}
              mt={3}
              variant="outlined"
              placeholder={i18n.t('Name')}
              borderRadius={3}
              backgroundColor={'muted.200'}
              fontSize={14}
              placeholderTextColor={'black'}
              value={representativeName}
              textAlign={textInputAlign()}
              onChangeText={setRepresentativeName}
            />
          </HStack>
          <Pressable
            onPress={() =>
              navigation.navigation.navigate('Countries', {
                countryId: countryId,
                type: 'Trainer',
              })
            }>
            <Box pointerEvents={'none'}>
              <Input
                editable={false}
                w={'93%'}
                height={12}
                alignSelf={'center'}
                shadow={3}
                variant="outlined"
                placeholder={i18n.t('Country')}
                value={country}
                mt={3}
                borderRadius={3}
                backgroundColor={'muted.200'}
                fontSize={14}
                textAlign={textInputAlign()}
                placeholderTextColor={'black'}
                InputRightElement={
                  <Image
                    source={require('../../assets/arrow-down-sign-to-navigate.png')}
                    h={3}
                    w={3}
                    resizeMode={'contain'}
                    alt={'no img'}
                    mx={3}
                  />
                }
              />
            </Box>
          </Pressable>
          <Input
            mt={3}
            w={'93%'}
            height={12}
            alignSelf={'center'}
            shadow={3}
            variant="outlined"
            placeholder={i18n.t('Email')}
            borderRadius={3}
            backgroundColor={'muted.200'}
            fontSize={14}
            placeholderTextColor={'black'}
            value={email}
            onChangeText={setEmail}
            keyboardType={'email-address'}
            textAlign={textInputAlign()}
          />
          <Input
            w={'93%'}
            height={12}
            alignSelf={'center'}
            shadow={3}
            variant="outlined"
            placeholder={i18n.t('Civil Id')}
            keyboardType={'number-pad'}
            mt={3}
            borderRadius={3}
            backgroundColor={'muted.200'}
            fontSize={14}
            placeholderTextColor={'black'}
            value={civilId}
            onChangeText={setCivilId}
            textAlign={textInputAlign()}
          />
          <Input
            w={'93%'}
            height={12}
            alignSelf={'center'}
            shadow={3}
            variant="outlined"
            placeholder={i18n.t('Address')}
            mt={3}
            borderRadius={3}
            backgroundColor={'muted.200'}
            fontSize={14}
            placeholderTextColor={'black'}
            value={address}
            onChangeText={setAddress}
            textAlign={textInputAlign()}
          />
        </VStack>
      </ScrollView>

      <Button
        onPress={validateCheck}
        variant={'solid'}
        rounded={8}
        mx={3}
        mb={4}
        isLoading={loading}
        isDisabled={loading}
        isLoadingText={'Submit'}
        spinnerPlacement={'end'}
        _text={{
          fontFamily: 'heading',
          fontWeight: 'bold',
          fontSize: 'md',
          color: '#fff',
        }}>
        {i18n.t('Submit')}
      </Button>
      <Modal
        justifyContent={'flex-end'}
        isOpen={show}
        onClose={() => setShow(false)}>
        <KeyboardAvoidingView behavior={'padding'}>
          <Modal.Content width={WIDTH} marginBottom={0} marginTop={'auto'}>
            <Modal.Body>
              <Modal.CloseButton alignSelf={'flex-end'} />
              <Text bold alignSelf={'center'} mb={3} fontSize={15}>
                {i18n.t('Enter mobile number')}
              </Text>
              <HStack
                alignItems={'center'}
                w={'94%'}
                alignSelf={'center'}
                justifyContent={'space-between'}>
                <Input
                  w={'20%'}
                  alignSelf={'center'}
                  shadow={3}
                  mt={3}
                  variant="outlined"
                  placeholder={i18n.t('Code')}
                  borderRadius={3}
                  backgroundColor={'muted.200'}
                  keyboardType={'number-pad'}
                  fontSize={14}
                  textAlign={textInputAlign()}
                  placeholderTextColor={'black'}
                  value={phoneCode}
                  onChangeText={setPhoneCode}
                  editable={false}
                />
                <Input
                  w={'75%'}
                  alignSelf={'center'}
                  shadow={3}
                  mt={3}
                  variant="outlined"
                  placeholder={i18n.t('Mobile number')}
                  borderRadius={3}
                  backgroundColor={'muted.200'}
                  keyboardType={'number-pad'}
                  fontSize={14}
                  textAlign={textInputAlign()}
                  placeholderTextColor={'black'}
                  value={otpNumber}
                  onChangeText={setOtpNumber}
                />
              </HStack>
            </Modal.Body>
            <Button
              onPress={otpLoader ? null : onNumberHandler}
              variant={'solid'}
              w={'95%'}
              rounded={8}
              alignSelf={'center'}
              mt={5}
              mb={4}
              _text={{
                fontFamily: 'heading',
                fontWeight: 'bold',
                fontSize: 'md',
                color: '#fff',
              }}>
              {otpLoader ? (
                <View>
                  <ActivityIndicator color={'white'} size={24} />
                </View>
              ) : (
                i18n.t('Submit')
              )}
            </Button>
          </Modal.Content>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        isOpen={visible}
        justifyContent={'flex-end'}
        onClose={() => setVisible(false)}
        safeAreaTop={true}>
        <KeyboardAvoidingView behavior={'padding'}>
          <Modal.Content width={WIDTH} marginBottom={0} marginTop={'auto'}>
            <Modal.Body>
              <Modal.CloseButton />
              <Text bold alignSelf={'center'} mb={3} fontSize={15}>
                {i18n.t('Enter verification code')}
              </Text>
              <FormControl>
                <Input
                  alignSelf={'center'}
                  variant="outlined"
                  placeholder="OTP"
                  borderRadius={3}
                  backgroundColor={'muted.200'}
                  fontSize={14}
                  placeholderTextColor={'black'}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType={'number-pad'}
                  textAlign={textInputAlign()}
                />
                <VStack alignSelf={'center'} mt={4}>
                  <Text mx={3} textAlign={'center'}>
                    {otpTimer}
                    {i18n.t('s')}
                  </Text>
                  <Text bold> {i18n.t('Resend')}</Text>
                </VStack>
              </FormControl>
            </Modal.Body>
            <Button
              onPress={() => onOtpHandler()}
              variant={'solid'}
              w={'95%'}
              rounded={8}
              alignSelf={'center'}
              mb={4}
              _text={{
                fontFamily: 'heading',
                fontWeight: 'bold',
                fontSize: 'md',
                color: '#fff',
              }}>
              {verifyLoader ? (
                <ActivityIndicator size={24} color={'white'} />
              ) : (
                i18n.t('Verify')
              )}
            </Button>
          </Modal.Content>
        </KeyboardAvoidingView>
      </Modal>
    </Box>
  );
};

export default TrainerDetailsScreen;
