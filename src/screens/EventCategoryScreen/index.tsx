import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Box, Divider, Input, Pressable, ScrollView, Text} from 'native-base';
import {FlatList} from 'react-native';
import Loader from '../../utility/Loader';
import {
  eventCategoryType,
  useEventList,
} from '../../hooks/EventCategory/useEventCategoryList';
import i18n from '../../language/I18n';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {countries} from '../../hooks/useInit';
import {textInputAlign} from '../../utility/Languagehelper';

const EventCategoryScreen = ({navigation, route}: any) => {
  const {data, title} = route.params;

  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const {eventCategoryList, dataLoading} = useEventList();
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState<
    eventCategoryType[]
  >([]);

  useEffect(() => {
    if (eventCategoryList) {
      setFilteredDataSource([...eventCategoryList]);
    }
  }, [eventCategoryList]);

  const onSearchHandler = (searchText: string) => {
    setFilteredDataSource(
      eventCategoryList.filter(
        (item: eventCategoryType) =>
          item.name_en.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name_ar.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  const onClickHandler = (value: number) => {
    setSelectedEvents(prevState => {
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
            navigation.replace('Event', {
              data: data,
              title: title,
              filterIds: selectedEvents,
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
  }, [navigation, selectedEvents]);

  const renderItem = ({item}: {item: eventCategoryType}) => {
    return (
      <Pressable onPress={() => onClickHandler(item.id)}>
        {selectedEvents.includes(item.id) ? (
          <>
            <Text
              alignItems="center"
              style={{marginVertical: 14, marginLeft: 12}}
              color={'#C46537'}
              fontSize={'lg'}
              textAlign={'left'}
              mb={1}>
              {i18n.locale === 'en' ? item.name_en : item.name_ar}
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
              style={{marginVertical: 14, marginLeft: 12}}
              color={'black'}
              fontSize={'lg'}
              textAlign={'left'}
              mb={1}>
              {i18n.locale === 'en' ? item.name_en : item.name_ar}
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

export default EventCategoryScreen;
