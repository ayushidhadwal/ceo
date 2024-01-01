import React, {useEffect, useRef, useState} from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import FilePicker, {types} from 'react-native-document-picker';
import DocumentPicker from 'react-native-document-picker';

import {ProgressBar} from '../../../component/ProgressBar';
import {showToast} from '../../../services/generalservices';
import {selectedDTO} from '../../PropertyScreen';
import httpClient from '../../../hooks/useHttp';
import {Dropdown} from 'react-native-element-dropdown';
import {useInit} from '../../../hooks/useInit';
import i18n from '../../../language/I18n';
import {textInputAlign} from '../../../utility/Languagehelper';
import validator from 'validator';

const WIDTH = Dimensions.get('screen').width;

type document = {
  uri: string;
  name: string | null;
  type: string | null;
};

const ProfileDetailsScreen = (navigation: any) => {
  const {genderType, dataLoading} = useInit();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [civilId, setCivilId] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [otpNumber, setOtpNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [license, setLicense] = useState<document>({
    uri: '',
    name: '',
    type: '',
  });
  const [logo, setLogo] = useState<document>({uri: '', name: '', type: ''});
  const [banner, setBanner] = useState<document>({uri: '', name: '', type: ''});
  const [etmaad, setEtmaad] = useState<document>({uri: '', name: '', type: ''});
  const [licenseLabel, setLicenseLabel] = useState<string | null>(
    i18n.t('Company License'),
  );
  const [logoLabel, setLogoLabel] = useState<string | null>(
    i18n.t('Company logo (500 * 500)'),
  );
  const [bannerLabel, setBannerLabel] = useState<string | null>(
    i18n.t('Banner (1000 * 500)'),
  );
  const [etmaadLabel, setEtmaadLabel] = useState<string | null>(
    i18n.t('Etemaad taukiya'),
  );
  const [countryId, setCountryId] = useState('');
  const [signature, setSignature] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneCodeModal, setPhoneCodeModal] = useState('');
  const [propertyList, setPropertyList] = useState<selectedDTO[]>([]);
  const [propertyType, setPropertyType] = useState<number[]>([]);
  const [propertyValue, setPropertyValue] = useState<string>('');

  const [isFocus, setIsFocus] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);

  const [otpLoader, setOtpLoader] = useState(false);

  const [verifyLoader, setVerifyLoader] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [otpTimer, setOtpTimer] = useState(59);

  const timerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.navigation.addListener('focus', () => {
      console.log('country', setCountry);
      if (navigation.route.params !== undefined) {
        if (navigation.route.params.countryName) {
          setCountryId(String(navigation.route.params.countryId));
          setCountry(String(navigation.route.params.countryName));
          setPhoneCode(String(navigation.route.params.phoneCode));
          setPhoneCodeModal(String(navigation.route.params.phoneCode));
        } else if (navigation.route.params.selected) {
          setPropertyList(navigation.route.params.selected);

          const ids = navigation.route.params.selected.map(
            (item: {id: number}) => item.id,
          );
          setPropertyType(ids);

          const names = navigation.route.params.selected.map(
            (item: {name: string}) => item.name,
          );

          const newValue = names.join(', ');
          setPropertyValue(
            prevValue => (prevValue ? prevValue + ', ' : '') + newValue,
          );
        } else if (navigation.route.params.sign) {
          setSignature(String(navigation.route.params.sign));
          console.log(String(navigation.route.params.sign));
        }
      }
    });

    return unsubscribe;
  }, [navigation.navigation, navigation.route]);

  // console.log(`${dropdownValue} ${representativeName}`);

  const onSubmitHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('vender', '1');
    formData.append('name', companyName);
    formData.append('email', email);
    formData.append('mobile', companyNumber);
    formData.append('query1', query);
    formData.append(
      'representative_name',
      `${dropdownValue} ${representativeName}`,
    );
    formData.append('address', address);
    formData.append('civil_id', civilId);

    if (logo?.uri) {
      formData.append('signature', {
        uri: `file://${signature}`,
        name: 'signature.pdf',
        type: 'image/png',
      });
    }

    if (logo?.uri) {
      formData.append('company_logo', {
        uri: logo.uri,
        type: logo.type,
        name: logo.name,
      });
    }

    if (banner?.uri) {
      formData.append('banner', {
        uri: banner.uri,
        type: banner.type,
        name: banner.name,
      });
    }

    if (license?.uri) {
      formData.append('company_license', {
        uri: license.uri,
        type: license.type,
        name: license.name,
      });
    }

    if (etmaad?.uri) {
      formData.append('etemaad_taukiya', {
        uri: etmaad.uri,
        type: etmaad.type,
        name: etmaad.name,
      });
    }

    formData.append('country_id', countryId);
    formData.append('property_type_id', propertyType);

    httpClient
      .post('/vendor-register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response: any) => {
        console.log('data', response.data);
        if (response.data.status === 'success') {
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
    Keyboard.dismiss();
    if (otpNumber === '') {
      showToast({msg: i18n.t('Please Enter Phone Number'), color: 'red'});
      return;
    }
    setOtpLoader(true);
    setQuery(otpNumber);
    setVerifyLoader(false);
    httpClient
      .post('number-verify', {
        phone: `${phoneCodeModal}${otpNumber}`,
      })
      .then((response: any) => {
        if (response.data.status === 'success') {
          showToast({msg: response?.data?.msg, color: 'green'});
          setShow(false);
          setVisible(true);
          handleTimer();
        }
        setOtpLoader(false);
      })
      .catch((error: any) => {
        showToast({msg: error?.message, color: 'red'});
        setOtpLoader(false);
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
        phone: `${phoneCodeModal}${otpNumber}`,
        otp: otp,
      })
      .then((response: any) => {
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

  const handleDocumentUpload = async (value: string) => {
    try {
      const response = await FilePicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.docx, types.images, types.doc, types.plainText],
      });

      if (value === 'license') {
        setLicenseLabel(response[0]?.name);
        setLicense({
          uri: response[0].uri,
          name: response[0]?.name,
          type: response[0]?.type,
        });
      } else if (value === 'logo') {
        setLogoLabel(response[0].name);
        setLogo({
          uri: response[0].uri,
          name: response[0].name,
          type: response[0].type,
        });
      } else if (value === 'banner') {
        setBannerLabel(response[0].name);
        setBanner({
          uri: response[0].uri,
          name: response[0].name,
          type: response[0].type,
        });
      } else if (value === 'etmaad') {
        setEtmaadLabel(response[0].name);
        setEtmaad({
          uri: response[0].uri,
          name: response[0].name,
          type: response[0].type,
        });
      }
    } catch (e) {
      if (DocumentPicker.isCancel(e)) {
        showToast({msg: i18n.t('User Cancelled'), color: 'red'});
      } else {
        showToast({
          msg: i18n.t('Unknown Error:') + JSON.stringify(e),
          color: 'red',
        });
        throw e;
      }
    }
  };

  const onClickHandler = async (value: string) => {
    if (Platform.OS === 'android' && +Platform.constants.Release >= 13) {
      handleDocumentUpload(value);
    } else {
      check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MEDIA_LIBRARY
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      )
        .then(result => {
          // console.log('result', result, RESULTS.DENIED);
          switch (result) {
            case RESULTS.GRANTED:
              handleDocumentUpload(value);
              // console.log(1);
              break;
            case RESULTS.UNAVAILABLE:
              showToast({
                msg: i18n.t('This feature is not available on this device'),
                color: 'red',
              });
              // console.log(6);
              break;
            case RESULTS.DENIED:
              request(
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.MEDIA_LIBRARY
                  : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
              ).then(requestResult => {
                requestResult === RESULTS.GRANTED,
                  requestResult,
                  RESULTS.GRANTED;
                if (requestResult === RESULTS.GRANTED) {
                  // console.log('neha');
                  handleDocumentUpload(value);
                  // console.log(2);
                }
              });
              break;
            case RESULTS.LIMITED:
              handleDocumentUpload(value);
              // console.log(3);
              break;
            case RESULTS.BLOCKED:
              showToast({
                msg: i18n.t(
                  'Permission Denied. Please Enable Storage Permission',
                ),
                color: 'red',
              });
              // console.log(4);
              openSettings().catch(settingsErr =>
                showToast({msg: settingsErr.message, color: 'red'}),
              );
              break;
          }
        })
        .catch(e => {
          // console.log(e);
          showToast({msg: e.message, color: 'red'});
        });
    }
  };

  // console.log('signature', signature);

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
      companyName === '' ||
      !email ||
      companyNumber === '' ||
      address === '' ||
      license.uri === '' ||
      logo.uri === '' ||
      etmaad.uri === '' ||
      banner.uri === '' ||
      countryId === '' ||
      !dropdownValue ||
      propertyType.length === 0 ||
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
  //         setIsAvailable(response.data.data.is_avaiable);
  //       });
  //   }
  // }, [email]);

  return (
    <ScrollView flex={1}>
      <KeyboardAwareScrollView>
        <StatusBar barStyle={'light-content'} hidden={show || visible} />

        <ProgressBar value={4} />

        <VStack>
          <Input
            w={'93%'}
            height={12}
            alignSelf={'center'}
            shadow={3}
            variant="outlined"
            placeholder={i18n.t('Company name')}
            borderRadius={3}
            backgroundColor={'muted.200'}
            fontSize={14}
            placeholderTextColor={'black'}
            value={companyName}
            onChangeText={setCompanyName}
            textAlign={textInputAlign()}
          />
          <Input
            w={'93%'}
            height={12}
            alignSelf={'center'}
            shadow={3}
            variant="outlined"
            placeholder={i18n.t('Email')}
            mt={3}
            borderRadius={3}
            backgroundColor={'muted.200'}
            fontSize={14}
            placeholderTextColor={'black'}
            value={email}
            onChangeText={setEmail}
            keyboardType={'email-address'}
            textAlign={textInputAlign()}
          />
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
                  source={require('../../../assets/arrow-down-sign-to-navigate.png')}
                  h={3}
                  w={3}
                  resizeMode={'contain'}
                  alt={'no img'}
                  mx={2}
                />
              )}
              style={{
                width: '30%',
                // height={12},
                alignSelf: 'center',
                marginTop: 12,
                borderRadius: 3,
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
              // iconStyle={{height: 32, width: 32}}
              // iconColor="black"
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
              value={dropdownValue}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setDropdownValue(item.value);
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
              placeholder={i18n.t('Representative Name')}
              borderRadius={3}
              backgroundColor={'muted.200'}
              fontSize={14}
              placeholderTextColor={'black'}
              value={representativeName}
              onChangeText={setRepresentativeName}
              textAlign={textInputAlign()}
            />
          </HStack>

          <Pressable
            onPress={() =>
              navigation.navigation.navigate('Countries', {
                countryId: countryId,
                type: 'Real Estate',
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
                mt={3}
                borderRadius={3}
                backgroundColor={'muted.200'}
                fontSize={14}
                placeholderTextColor={'black'}
                value={country}
                textAlign={textInputAlign()}
                InputRightElement={
                  <Image
                    source={require('../../../assets/arrow-down-sign-to-navigate.png')}
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

          <HStack
            alignItems={'center'}
            w={'94%'}
            alignSelf={'center'}
            justifyContent={'space-between'}>
            <Input
              w={'30%'}
              height={12}
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
              w={'68%'}
              height={12}
              alignSelf={'center'}
              shadow={3}
              mt={3}
              variant="outlined"
              placeholder={i18n.t('Company number')}
              borderRadius={3}
              backgroundColor={'muted.200'}
              keyboardType={'number-pad'}
              fontSize={14}
              placeholderTextColor={'black'}
              value={companyNumber}
              onChangeText={setCompanyNumber}
              textAlign={textInputAlign()}
            />
          </HStack>
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

          <Pressable onPress={() => onClickHandler('license')}>
            <HStack
              w={'93%'}
              alignSelf={'center'}
              mt={3}
              borderRadius={3}
              backgroundColor={'muted.200'}
              // shadow={3}
              p={3}
              justifyContent={'space-between'}>
              <Text textAlign={'left'} flex={1} fontSize={14}>
                {licenseLabel}
              </Text>
              <Image
                source={require('../../../assets/icons/documentupload.png')}
                h={5}
                w={5}
                alt={'no img'}
              />
            </HStack>
          </Pressable>

          {licenseLabel !== i18n.t('Company License') && (
            <Text
              color={'green.800'}
              ml={5}
              mt={1}
              textAlign={'left'}
              fontWeight={'bold'}
              fontSize={11}>
              {i18n.t('Company')}
            </Text>
          )}
          <Pressable onPress={() => onClickHandler('etmaad')}>
            <HStack
              w={'93%'}
              alignSelf={'center'}
              mt={3}
              borderRadius={3}
              backgroundColor={'muted.200'}
              // shadow={3}
              p={3}
              justifyContent={'space-between'}>
              <Text textAlign={'left'} flex={1} fontSize={14}>
                {etmaadLabel}
              </Text>

              <Image
                source={require('../../../assets/icons/documentupload.png')}
                alt={'no img'}
                h={5}
                w={5}
              />
            </HStack>
          </Pressable>
          {etmaadLabel !== i18n.t('Etemaad taukiya') && (
            <Text
              color={'green.800'}
              textAlign={'left'}
              ml={5}
              mt={1}
              fontWeight={'bold'}
              fontSize={11}>
              {i18n.t('Etemaad')}
            </Text>
          )}
          <Pressable onPress={() => onClickHandler('logo')}>
            <HStack
              w={'93%'}
              alignSelf={'center'}
              mt={3}
              borderRadius={3}
              backgroundColor={'muted.200'}
              // shadow={3}
              p={3}
              justifyContent={'space-between'}>
              <Text textAlign={'left'} flex={1} fontSize={14}>
                {logoLabel}
              </Text>
              <Image
                source={require('../../../assets/icons/documentupload.png')}
                alt={'no img'}
                h={5}
                w={5}
              />
            </HStack>
          </Pressable>
          {logoLabel !== i18n.t('Company logo (500 * 500)') && (
            <Text
              textAlign={'left'}
              color={'green.800'}
              ml={5}
              mt={1}
              fontWeight={'bold'}
              fontSize={11}>
              {i18n.t('Logo')}
            </Text>
          )}
          <Pressable onPress={() => onClickHandler('banner')}>
            <HStack
              w={'93%'}
              alignSelf={'center'}
              mt={3}
              borderRadius={3}
              backgroundColor={'muted.200'}
              // shadow={3}
              p={3}
              justifyContent={'space-between'}>
              <Text textAlign={'left'} flex={1} fontSize={14}>
                {bannerLabel}
              </Text>
              <Image
                source={require('../../../assets/icons/documentupload.png')}
                alt={'no img'}
                h={5}
                w={5}
              />
            </HStack>
          </Pressable>
          {bannerLabel !== i18n.t('Banner (1000 * 500)') && (
            <Text
              color={'green.800'}
              textAlign={'left'}
              ml={5}
              mt={1}
              fontWeight={'bold'}
              fontSize={11}>
              {i18n.t('Banner')}
            </Text>
          )}

          <Pressable
            onPress={() => {
              setPropertyValue('');
              navigation.navigation.navigate('Property Type', {
                propertyList: propertyList,
              });
            }}>
            <Box pointerEvents={'none'} alignItems={'center'} height={12}>
              <Input
                editable={false}
                w={'93%'}
                height={'105%'}
                alignSelf={'center'}
                shadow={3}
                variant="outlined"
                placeholder={i18n.t('Property Type')}
                mt={3}
                borderRadius={3}
                backgroundColor={'muted.200'}
                fontSize={14}
                numberOfLines={1}
                textAlign={textInputAlign()}
                multiline={propertyValue.split(', ').length > 3 ? true : false}
                placeholderTextColor={'black'}
                value={propertyValue}
                InputRightElement={
                  <Image
                    source={require('../../../assets/arrow-down-sign-to-navigate.png')}
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
        </VStack>
        <Button
          onPress={validateCheck}
          variant={'solid'}
          w={'95%'}
          rounded={8}
          isLoading={loading}
          isDisabled={loading}
          isLoadingText={'Submit'}
          spinnerPlacement={'end'}
          alignSelf={'center'}
          mt={10}
          mb={4}
          _text={{
            fontFamily: 'heading',
            fontWeight: 'bold',
            fontSize: 'md',
            color: 'white',
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
                    placeholderTextColor={'black'}
                    value={phoneCodeModal}
                    textAlign={textInputAlign()}
                    onChangeText={setPhoneCodeModal}
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
                    placeholderTextColor={'black'}
                    value={otpNumber}
                    textAlign={textInputAlign()}
                    onChangeText={text => {
                      console.log(text);
                      setOtpNumber(text);
                    }}
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
                  color: 'white',
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
                    <Text bold>{i18n.t('Resend')}</Text>
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
                  color: 'white',
                }}>
                {verifyLoader ? (
                  <View>
                    <ActivityIndicator color={'white'} size={24} />
                  </View>
                ) : (
                  i18n.t('Verify')
                )}
              </Button>
            </Modal.Content>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default ProfileDetailsScreen;
