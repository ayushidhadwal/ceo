import React, {useEffect, useState} from 'react';
import {Box, Divider, HStack, Image, Input, Pressable, Text} from 'native-base';
import {FlatList} from 'react-native';
import {countries, useInit} from '../../../hooks/useInit';
import Loader from '../../../utility/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {textInputAlign} from '../../../utility/Languagehelper';

const useCountryList = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    (async () => {
      const countryList = await AsyncStorage.getItem('COUNTRY_LIST');
      if (countryList) {
        setList(JSON.parse(countryList));
      }
    })();
  }, []);
  return list;
};

const CountryScreen = (navigation: any) => {
  const countryId = navigation.route.params.countryId;
  const type = navigation.route.params.type;
  // const {countryList, dataLoading} = useInit();
  const countryList = useCountryList();
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState<countries[]>([]);

  useEffect(() => {
    if (countryList) {
      setFilteredDataSource([...countryList]);
    }
  }, [countryList]);

  const onSearchHandler = (searchText: string) => {
    setFilteredDataSource(
      countryList.filter(
        (item: countries) =>
          item.title_en.toLowerCase().includes(searchText.toLowerCase()) ||
          item.title_ar.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  const renderItem = ({item}: {item: countries}) => {
    return (
      <Pressable
        mt={2}
        alignSelf={'center'}
        w={'95%'}
        onPress={() => {
          type === 'Trainer'
            ? navigation.navigation.navigate('Trainer Details', {
                countryName:
                  i18n.locale === 'en' ? item.title_en : item.title_ar,
                countryId: item.id,
                phoneCode: item.phone_code,
              })
            : navigation.navigation.navigate('Profile Details', {
                countryName:
                  i18n.locale === 'en' ? item.title_en : item.title_ar,
                countryId: item.id,
                phoneCode: item.phone_code,
              });
        }}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <HStack alignItems={'center'}>
            <Image
              source={{uri: item.image_url}}
              w={10}
              h={10}
              alt={'no img'}
            />
            <Text
              color={String(countryId) === String(item.id) ? '#C46537' : '#000'}
              p={2}
              my={2}
              fontSize={15}>
              {i18n.locale === 'en' ? item.title_en : item.title_ar}
            </Text>
          </HStack>
          <Text
            color={String(countryId) === String(item.id) ? '#C46537' : '#000'}
            p={2}
            my={2}
            fontSize={15}>
            {item.phone_code}
          </Text>
        </HStack>
        <Divider />
      </Pressable>
    );
  };

  return (
    <Box flex={1}>
      {/*{dataLoading ? (*/}
      {/*  <Loader />*/}
      {/*) : (*/}
      <>
        <Input
          size={'md'}
          alignSelf={'center'}
          variant="outlined"
          w={'95%'}
          mt={3}
          backgroundColor={'muted.200'}
          textAlign={textInputAlign()}
          InputLeftElement={
            <AntDesign
              name="search1"
              size={18}
              color="#C46537"
              style={{marginLeft: 10}}
            />
          }
          placeholder={i18n.t('Type here to search')}
          placeholderTextColor={'gray.400'}
          value={search}
          onChangeText={onSearchHandler}
        />
        <FlatList
          renderItem={renderItem}
          data={filteredDataSource}
          keyExtractor={item => String(item.id)}
        />
      </>
      {/*)}*/}
    </Box>
  );
};

export default CountryScreen;
