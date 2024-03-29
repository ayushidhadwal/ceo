import React from 'react';
import {SvgFromXml} from 'react-native-svg';

type Props = {
  color: string;
};
const OfficeSvg = ({color}: Props) => {
  const xml = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" style="&#10;    stroke: ${color};&#10;">
<path d="M10.9041 13.5755V12.644H15.726V3.93164H2.63014V12.644H7.45205V13.5755H0V24.0686H0.821918V14.3974H27.1781V24.0686H28V13.5755H10.9041ZM5.50104 4.75356L6.69534 5.94786L7.27649 5.36671L6.66334 4.75356H14.9041V10.0686H11.9784L8.15255 6.24276L7.5714 6.82391L10.8161 10.0686H3.45205V4.75356H5.50104ZM3.45205 10.8905H14.9041V11.8221H3.45205V10.8905ZM8.27397 12.644H10.0822V13.5755H8.27397V12.644Z" fill="white"/>
<path d="M15.7808 24.0688H16.6027V23.1647H25.4246V24.0688H26.2465V15.3291H15.7808V24.0688ZM16.6027 22.3428V19.6579H25.4246V22.3428H16.6027ZM25.4246 16.151V18.836H16.6027V16.151H25.4246Z" fill="white"/>
<path d="M22.3287 20.5889H20.137V21.4108H22.3287V20.5889Z" fill="white"/>
<path d="M22.3287 17.082H20.137V17.9039H22.3287V17.082Z" fill="white"/>
<path d="M26.2739 12.2607H20.137V13.0827H26.2739V12.2607Z" fill="white"/>
<path d="M26.2739 10.9453H20.137V11.7672H26.2739V10.9453Z" fill="white"/>
<path d="M25.3972 9.62988H20.137V10.4518H25.3972V9.62988Z" fill="white"/>
</svg>`;
  return <SvgFromXml xml={xml} />;
};
export default OfficeSvg;
