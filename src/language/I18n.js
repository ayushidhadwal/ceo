// import I18n from 'i18n-js';
//
// import en from './en';
// import ar from './ar';
//
// // const i18n = new I18n();
//
// I18n.enableFallback = true;
//
// I18n.translations = {
//   en,
//   ar,
// };
//
// export default I18n;


import i18n from 'i18n-js';

import en from './en';
import ar from './ar';

// i18n.locale = 'en';
i18n.enableFallback = true;

i18n.translations = {
  en,
  ar,
};

export default i18n;
