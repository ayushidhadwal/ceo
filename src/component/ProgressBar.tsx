import React, {FC} from 'react';
import {Box, HStack, Text} from 'native-base';
import {number} from 'yup';

export type Props = {
  value: number;
};

const arr = [1, 2, 3, 4];

export const ProgressBar: FC<Props> = ({value}) => {
  return (
    <HStack
      w={'60%'}
      my={4}
      justifyContent={'space-between'}
      alignSelf={'center'}>
      {arr.map(m => (
        <Box
          key={m}
          w={10}
          h={10}
          alignItems={'center'}
          justifyContent={'center'}
          borderRadius={100}
          borderWidth={value > m ? 1 : 0}
          // shadow={1}
          borderColor={
            value > m
              ? '#000000'
              : value === m
              ? 'primary.400'
              : 'background.400'
          }
          bg={value === m ? 'primary.400' : '#E7C1AF'}
          borderStyle={value > m ? 'dashed' : 'solid'}>
          <Text
            fontFamily={'heading'}
            fontWeight={'bold'}
            fontStyle={'normal'}
            fontSize={'md'}
            color={value === m ? 'white' : value > m ? 'black' : 'black'}>
            {m}
          </Text>
        </Box>
      ))}
    </HStack>
  );
};
