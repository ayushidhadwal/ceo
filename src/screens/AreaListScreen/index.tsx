import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Box, Divider, Input, Pressable, ScrollView, Text} from 'native-base';
import {FlatList} from 'react-native';
import {areaType, useAreaList} from '../../hooks/Area/useAreaList';
import Loader from '../../utility/Loader';
import i18n from '../../language/I18n';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {textInputAlign} from '../../utility/Languagehelper';

const AreaListScreen = ({navigation, route}: any) => {
  const {data, title, screenName} = route.params;

  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const {areaList, dataLoading} = useAreaList();
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState<areaType[]>([]);

  useEffect(() => {
    if (areaList) {
      setFilteredDataSource([...areaList]);
    }
  }, [areaList]);

  const onSearchHandler = (searchText: string) => {
    setFilteredDataSource(
      areaList.filter(
        (item: areaType) =>
          item.title_en.toLowerCase().includes(searchText.toLowerCase()) ||
          item.title_ar.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  const onClickHandler = (value: number) => {
    setSelectedCountries(prevState => {
      const a = [...prevState];

      const i = a.findIndex(m => m === value);
      if (i > -1) {
        a.splice(i, 1);
      } else {
        a.push(value);
      }
      return a;
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            screenName === 'EventAreaList'
              ? navigation.replace('Event', {
                  data: data,
                  title: title,
                  countryIds: selectedCountries,
                })
              : navigation.replace('PropertyListingScreen', {
                  data: data,
                  title: title,
                  countryIds: selectedCountries,
                });
          }}
          style={{
            backgroundColor: '#C46537',
            marginRight: 15,
            padding: 7,
            borderRadius: 5,
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            {i18n.t('Filter')}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, selectedCountries]);
  const renderItem = ({item}: {item: areaType}) => {
    return (
      <Pressable
        style={{marginLeft: 13}}
        onPress={() => onClickHandler(item.id)}>
        {selectedCountries.includes(item.id) ? (
          <>
            <Text
              alignItems="center"
              style={{marginVertical: 14, marginLeft: 2}}
              color={'#C46537'}
              textAlign={'left'}
              fontSize={'lg'}>
              {i18n.locale === 'en' ? item.title_en : item.title_ar}
            </Text>
            <Divider
              _dark={{
                bg: '#F1F1F1',
              }}
            />
          </>
        ) : (
          <>
            <Text
              alignItems="center"
              style={{marginVertical: 14, marginLeft: 2}}
              color={'black'}
              textAlign={'left'}
              fontSize={'lg'}>
              {i18n.locale === 'en' ? item.title_en : item.title_ar}
            </Text>
            <Divider
              _dark={{
                bg: '#F1F1F1',
              }}
            />
          </>
        )}
      </Pressable>
    );
  };
  return (
    <Box flex={1}>
      {dataLoading ? (
        <Loader />
      ) : (
        <>
          <ScrollView>
            <Input
              size={'md'}
              alignSelf={'center'}
              variant="Filled"
              w={'95%'}
              mt={3}
              backgroundColor={'white'}
              shadow={3}
              InputLeftElement={
                <AntDesign
                  name="search1"
                  size={18}
                  color="#C46537"
                  style={{marginLeft: 10}}
                />
              }
              placeholder={i18n.t('Search')}
              placeholderTextColor={'gray.400'}
              value={search}
              onChangeText={onSearchHandler}
              textAlign={textInputAlign()}
            />
            <FlatList
              data={filteredDataSource}
              renderItem={renderItem}
              keyExtractor={item => String(item.id)}
            />
          </ScrollView>
        </>
      )}
    </Box>
  );
};

export default AreaListScreen;
