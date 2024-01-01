import {Box} from 'native-base';
import React from 'react';
import {ActivityIndicator} from 'react-native';

const Loader = () => {
  return (
    <Box
      flex={1}
      justifyContent={'center'}
      alignItems={'center'}
      color={'#C46537'}>
      <ActivityIndicator color={'#C46537'} size={'small'} />
    </Box>
  );
};
export default Loader;
