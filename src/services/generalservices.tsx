import {duration} from 'moment';
import {Box, Center, Skeleton, Toast, VStack} from 'native-base';
import {ColorType} from 'native-base/lib/typescript/components/types';
import React from 'react';
import {
  //   ActivityIndicator,
  StyleSheet,
  View,
  ToastAndroid,
  Text,
  ImageStyle,
  I18nManager,
  Pressable,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
// import { StyleProps } from 'react-native-reanimated';

export const LoaderService = () => {
  return (
    <View style={style.loading}>
      {/* <ActivityIndicator size={'large'} color={"primary.200"}/> */}
      <ActivityIndicator color="#C46537" />
    </View>
  );
};

export const ImageLoad = ({
  url,
  style,
  link,
}: {
  url: string;
  style: any;
  link: string;
}) => {
  return (
    <Pressable onpress={() => Linking.openURL(link)}>
      <FastImage
        style={[{width: '100%', height: 160}, style]}
        onLoad={val => {
          return <ActivityIndicator />;
        }}
        source={{
          uri: url,

          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </Pressable>
  );
};
export const HomePageSkeleton = () => {
  return (
    <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
      <Skeleton height={62} startColor="gray.200" endColor="gray.400" />

      <Center w="100%" marginTop={5}>
        <VStack
          w="90%"
          maxW="100%"
          overflow="hidden"
          rounded="md"
          _dark={{
            borderColor: 'coolGray.500',
          }}
          _light={{
            borderColor: 'coolGray.200',
          }}>
          <Skeleton
            height={160}
            borderRadius={10}
            startColor="gray.200"
            endColor="gray.400"
          />
          <View
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              marginVertical: 0,
              marginHorizontal: -8,
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Skeleton
              startColor="gray.200"
              endColor="gray.400"
              style={{
                height: 60,
                flexBasis: '45%',
                marginTop: 8,
                marginHorizontal: 8,
                borderRadius: 8,
              }}
            />
            <Skeleton
              startColor="gray.200"
              endColor="gray.400"
              style={{
                height: 60,
                flexBasis: '45%',
                marginTop: 8,
                marginHorizontal: 8,
                borderRadius: 8,
              }}
            />
            <Skeleton
              startColor="gray.200"
              endColor="gray.400"
              style={{
                height: 60,
                flexBasis: '25.3%',
                marginTop: 8,
                marginHorizontal: 8,
                borderRadius: 8,
              }}
            />
            <Skeleton
              startColor="gray.200"
              endColor="gray.400"
              style={{
                height: 60,
                flexBasis: '25.3%',
                marginTop: 8,
                marginHorizontal: 8,
                borderRadius: 8,
              }}
            />
            <Skeleton
              startColor="gray.200"
              endColor="gray.400"
              style={{
                height: 60,
                flexBasis: '25.3%',
                marginTop: 8,
                marginHorizontal: 8,
                borderRadius: 8,
              }}
            />
          </View>

          {/* //------------------- */}
          <Center style={{height: 230, marginTop: 26, width: '100%'}}>
            <VStack
              w="100%"
              borderWidth="1"
              overflow="hidden"
              rounded="md"
              _dark={{
                borderColor: 'gray.200',
              }}
              _light={{
                borderColor: 'gray.400',
              }}>
              <Skeleton h="40" startColor="gray.200" endColor="gray.400" />
              <Skeleton.Text
                px="4"
                my="4"
                startColor="gray.200"
                lines={2}
                endColor="gray.400"
              />
            </VStack>
          </Center>
          <Center style={{height: 230, marginTop: 26, width: '100%'}}>
            <VStack
              w="100%"
              borderWidth="1"
              overflow="hidden"
              rounded="md"
              _dark={{
                borderColor: 'gray.200',
              }}
              _light={{
                borderColor: 'gray.400',
              }}>
              <Skeleton h="40" startColor="gray.200" endColor="gray.400" />
              <Skeleton.Text
                px="4"
                my="4"
                startColor="gray.200"
                lines={2}
                endColor="gray.400"
              />
              {/* <Skeleton px="4" my="4" rounded="md" startColor="primary.100" /> */}
            </VStack>
          </Center>
          <Center style={{height: 230, marginTop: 26, width: '100%'}}>
            <VStack
              w="100%"
              //   maxW="100%"
              borderWidth="1"
              //   space={8}
              overflow="hidden"
              rounded="md"
              _dark={{
                borderColor: 'gray.200',
              }}
              _light={{
                borderColor: 'gray.400',
              }}>
              <Skeleton h="40" startColor="gray.200" endColor="gray.400" />
              <Skeleton.Text
                px="4"
                my="4"
                startColor="gray.200"
                lines={2}
                endColor="gray.400"
              />
              {/* <Skeleton px="4" my="4" rounded="md" startColor="primary.100" /> */}
            </VStack>
          </Center>
        </VStack>
      </Center>
    </ScrollView>
  );
};

export const showToast = ({msg, color}: {msg: string; color: ColorType}) => {
  // console.log('Toast');
  // Toast.show({
  //   duration:1000,

  //   render: () => {
  //     return (
  //       <Box bg={color} px="2" py="1" rounded="sm" mb={5}>
  //         <Text style={{color: 'white'}}>{msg}</Text>
  //       </Box>
  //     );
  //   },
  // });
  if (msg) {
    Snackbar.show({
      text: msg || 'Something went to wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: (color as string) || '#E7C1A',
      textColor: 'white',
      rtl: I18nManager.isRTL,
    });
  }
};

const style = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
