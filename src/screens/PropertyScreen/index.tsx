import React, {useEffect, useState} from 'react';
import {Box, Button, Divider, Input, Pressable, Text} from 'native-base';
import {FlatList} from 'react-native';

import {countries, propertyTypeDTO, useInit} from '../../hooks/useInit';
import Loader from '../../utility/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import i18n from 'i18n-js';
import {textInputAlign} from '../../utility/Languagehelper';

export type selectedDTO = {
  id: number;
  name: string;
};

const PropertyScreen = (navigation: any) => {
  const {propertyType, dataLoading} = useInit();
  const propertyList = navigation.route.params.propertyList;
  const [selected, setSelected] = useState<selectedDTO[]>([...propertyList]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState<
    propertyTypeDTO[]
  >([]);

  useEffect(() => {
    if (propertyType) {
      setFilteredDataSource([...propertyType]);
    }
  }, [propertyType]);

  const onSearchHandler = (searchText: string) => {
    setFilteredDataSource(
      propertyType.filter(
        (item: propertyTypeDTO) =>
          item.name_en.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name_ar.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  const onHandle = (val: number, name: string) => {
    setSelected(prevState => {
      const x = [...prevState];
      const i = x.findIndex(n => n?.id === val);
      if (i >= 0) {
        x.splice(i, 1);
      } else {
        x.push({
          id: val,
          name: name,
        });
      }
      return x;
    });
  };

  const onPressHandler = () => {
    navigation.navigation.navigate('Profile Details', {
      selected: selected,
    });
  };

  const renderItem = ({item}: {item: propertyTypeDTO}) => {
    return (
      <Pressable
        onPress={() => onHandle(item.id, item.name_en)}
        mt={2}
        alignSelf={'center'}
        w={'95%'}>
        {selected?.some(i => i.id === item.id) ? (
          <Text textAlign={'left'} p={2} my={2} fontSize={15} color={'#C46537'}>
            {item.name_en}
          </Text>
        ) : (
          <Text textAlign={'left'} p={2} my={2} fontSize={15} color={'#000'}>
            {item.name_en}
          </Text>
        )}
        <Divider />
      </Pressable>
    );
  };

  return (
    <Box flex={1}>
      {dataLoading ? (
        <Loader />
      ) : (
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
            // data={propertyType}
            renderItem={renderItem}
            data={filteredDataSource}
            keyExtractor={item => String(item.id)}
          />
          <Button
            onPress={() => onPressHandler()}
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
            {i18n.t('Add')}
          </Button>
        </>
      )}
    </Box>
  );
};

export default PropertyScreen;
