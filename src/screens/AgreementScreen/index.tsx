import React, {useState} from 'react';
import {Box, Button, HStack, Pressable, ScrollView, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {ProgressBar} from '../../component/ProgressBar';
import i18n from '../../language/I18n';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Dimensions, Platform} from 'react-native';
import Pdf from 'react-native-pdf';
import Loader from '../../utility/Loader';
import {useInit} from '../../hooks/useInit';
import {useAppSelector} from '../../store/hooks';

const AgreementScreen = (navigation: any) => {
  const {partnerContractUrl, trainerContractUrl} = useAppSelector(state => {
    return {
      partnerContractUrl: state?.master?.appData?.Partner_contract_url,
      trainerContractUrl: state?.master?.appData?.Trainer_contract_url,
    };
  });
  console.log('partnerContractUrl', partnerContractUrl);

  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const WIDTH = Dimensions.get('window').width;
  const {dataLoading} = useInit();

  const type = navigation.route.params.type;
  const source1 = {
    uri: partnerContractUrl,
    cache: true,
  };
  const source2 = {
    uri: trainerContractUrl,
    cache: true,
  };

  const PDFWrapper = Platform.OS === 'ios' ? Box : ScrollView;

  return (
    <Box safeAreaBottom flex={1}>
      <ProgressBar value={2} />
      {dataLoading ? (
        <Loader />
      ) : (
        <PDFWrapper flex={1}>
          <Box h={1600} w={WIDTH} flexShrink={1}>
            <Pdf
              onLoadComplete={() => {
                setDisabled(false);
              }}
              trustAllCerts={false}
              source={type === 'Partner' ? source1 : source2}
              onError={error => {
                console.log(error);
              }}
              style={{
                flex: 1,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
            />
          </Box>
        </PDFWrapper>
      )}
      <Box mb={5}>
        <HStack ml={5} alignItems={'center'} opacity={disabled ? 0.5 : 1}>
          {checked ? (
            <Pressable
              onPress={() => setChecked(!checked)}
              borderWidth={1}
              borderColor={'#C46537'}
              size="5"
              bg={'#E7C1AF'}
              alignItems={'center'}
              justifyContent={'center'}>
              <AntDesign name="check" size={15} color="#C46537" />
            </Pressable>
          ) : (
            <Pressable disabled={disabled} onPress={() => setChecked(!checked)}>
              <Ionicons name="square-outline" size={24} color="#C46537" />
            </Pressable>
          )}
          <Text ml={2} fontSize={16} fontWeight={'bold'} color={'black'}>
            {i18n.t('I accept the terms and conditions')}
          </Text>
        </HStack>

        <HStack
          w={'95%'}
          backgroundColor={'yellow'}
          alignSelf={'center'}
          justifyContent={'space-between'}
          mt={'5%'}>
          <Button
            onPress={() => navigation.navigation.navigate('Partner with us')}
            variant={'solid'}
            w={'40%'}
            rounded={8}
            alignSelf={'center'}
            _text={{
              fontFamily: 'heading',
              fontWeight: 'bold',
              fontSize: 'md',
              color: 'white',
            }}
            colorScheme={'primary'}>
            {i18n.t('Back')}
          </Button>
          <Button
            onPress={() =>
              navigation.navigation.navigate('Signature', {type: type})
            }
            variant={'solid'}
            isDisabled={!checked}
            w={'40%'}
            rounded={8}
            alignSelf={'center'}
            _text={{
              fontFamily: 'heading',
              fontWeight: 'bold',
              fontSize: 'md',
              color: 'white',
            }}>
            {i18n.t('Next')}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default AgreementScreen;
