import React, {useState} from 'react';
import {Box, Button, HStack, Image, Pressable, Text} from 'native-base';

import {ProgressBar} from '../../component/ProgressBar';
import {useInit} from '../../hooks/useInit';
import Loader from '../../utility/Loader';
import i18n from '../../language/I18n';
import {SafeAreaView} from 'react-native-safe-area-context';

const TypeCard = ({
  title,
  activeImage,
  inactiveImage,
  isActive,
  onPress,
}: any) => {
  return (
    <Pressable
      flex={1}
      onPress={onPress}
      backgroundColor={isActive ? '#C46537' : '#ffffff'}
      shadow={5}
      borderRadius={7}
      p={1}
      alignItems="center">
      <Image
        key={isActive}
        source={isActive ? activeImage : inactiveImage}
        alt={'no img'}
        m={5}
        size={'xs'}
      />

      <Text fontSize={19} m={2} color={isActive ? '#ffffff' : '#000000'}>
        {title === 'Partner' ? 'Real Estate' : title}
      </Text>
    </Pressable>
  );
};

const TypeScreen = (navigation: any) => {
  const [select, setSelect] = useState('');
  const {partnerType, dataLoading} = useInit();

  return (
    <Box flex={1}>
      {dataLoading ? (
        <Loader />
      ) : (
        <SafeAreaView edges={['bottom']} style={{flex: 1}}>
          <ProgressBar value={1} />
          <Box flex={1} justifyContent="center">
            <HStack padding={8} space={8}>
              {partnerType.map(m => {
                console.log('hj', partnerType);
                return (
                  <TypeCard
                    key={m.id}
                    title={i18n.locale === 'en' ? m.name_en : m.name_ar}
                    activeImage={
                      m.name_en === 'Real Estate' || m.name_ar === 'العقارات'
                        ? require('../../assets/icons/whitecondo.png')
                        : require('../../assets/icons/whitecoach.png')
                    }
                    inactiveImage={
                      m.name_en === 'Real Estate' || m.name_ar === 'العقارات'
                        ? require('../../assets/condoorange.png')
                        : require('../../assets/coachorange.png')
                    }
                    isActive={select === m.name_en}
                    onPress={() => setSelect(m.name_en)}
                  />
                );
              })}
            </HStack>
          </Box>
          <Box>
            <Button
              onPress={() =>
                navigation.navigation.navigate('Agreement', {type: select})
              }
              isDisabled={select === ''}
              variant={'solid'}
              m={3}
              rounded={8}
              _text={{
                fontFamily: 'heading',
                fontWeight: 'bold',
                fontSize: 'md',
                color: 'white',
              }}
              colorScheme={'primary'}>
              {i18n.t('Proceed')}
            </Button>
          </Box>
        </SafeAreaView>
      )}
    </Box>
  );
};

export default TypeScreen;
