import I18n from 'i18n-js';
import {I18nManager} from 'react-native';

export const textInputAlign = () => {
  return I18nManager.isRTL ? 'right' : 'left';
};
