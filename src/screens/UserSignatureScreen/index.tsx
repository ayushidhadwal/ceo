import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, HStack} from 'native-base';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import RNFS from 'react-native-fs';

import {ProgressBar} from '../../component/ProgressBar';
import i18n from '../../language/I18n';

const UserSignatureScreen = (navigation: any) => {
  const [img, setImg] = useState('');
  const [userType, setUserType] = useState(navigation.route.params.type);
  const [loading, setLoading] = useState<null | boolean>(null);
  const [active, setActive] = useState<boolean>(true);
  const ref = useRef<SignatureViewRef>();

  const handleOK = (signature: any) => {
    setLoading(true);
    const imagePath = `${RNFS.TemporaryDirectoryPath}image.png`;
    RNFS.writeFile(
      imagePath,
      signature.replace('data:image/png;base64,', ''),
      'base64',
    ).then(() => {
      setImg(imagePath);
      setLoading(false);
    });
  };

  const handleClear = () => {
    setActive(true);
    ref?.current?.clearSignature();
  };

  const handleConfirm = () => {
    ref?.current?.readSignature();
  };

  useEffect(() => {
    if (loading === false) {
      userType === 'Trainer'
        ? navigation.navigation.navigate('Trainer Details', {sign: img})
        : navigation.navigation.navigate('Profile Details', {
            sign: img,
          });
    }
  }, [loading]);

  const style = '.m-signature-pad--footer {display: none; margin: 0px;}';
  return (
    <Box safeAreaBottom flex={1}>
      <Box flex={1}>
        <ProgressBar value={3} />
        <Box flex={0.6} mx={5}>
          <SignatureScreen
            ref={ref}
            onEnd={() => setActive(false)}
            onOK={handleOK}
            webStyle={style}
          />
          <Button
            _text={{
              fontFamily: 'heading',
              fontWeight: 'bold',
              fontSize: 'sm',
              color: 'white',
            }}
            mt={3}
            isDisabled={active}
            alignSelf={'flex-end'}
            w={'30%'}
            colorScheme={'primary'}
            rounded={8}
            onPress={handleClear}>
            {i18n.t('Clear')}
          </Button>
          {/*<Button*/}
          {/*  _text={{*/}
          {/*    fontFamily: 'heading',*/}
          {/*    fontWeight: 'bold',*/}
          {/*    fontSize: 'md',*/}
          {/*    color: '#000',*/}
          {/*  }}*/}
          {/*  w={'40%'}*/}
          {/*  colorScheme={'primary'}*/}
          {/*  rounded={8}*/}
          {/*  onPress={handleConfirm}>*/}
          {/*  Confirm*/}
          {/*</Button>*/}
        </Box>
      </Box>
      <Box padding={2}>
        <HStack justifyContent={'space-between'} mx={2}>
          <Button
            onPress={() => navigation.navigation.goBack()}
            variant={'solid'}
            w={'40%'}
            rounded={8}
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
            onPress={() => {
              ref?.current?.readSignature();
            }}
            variant={'solid'}
            isDisabled={loading || active}
            w={'40%'}
            backgroundColor={'#C46537'}
            rounded={8}
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

export default UserSignatureScreen;
