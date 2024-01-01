import React from 'react';
import {SvgFromXml} from 'react-native-svg';

type Props = {
  color: string;
};
const WorkSpaceSvg = ({color}: Props) => {
  const xml = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 28 27" style="enable-background:new 0 0 28 27;" xml:space="preserve">
<style type="text/css">
	.st0{stroke:#F9F9F9;stroke-width:0.25;{"}"}
</style>
<path class="st0" d="M8,3.5c0,1.6-1.3,2.9-2.9,2.9c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9C6.7,0.7,8,2,8,3.5z M7.1,3.5  c0-1.1-0.9-2-2-2c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2C6.2,5.5,7.1,4.6,7.1,3.5z"/>
<path class="st0" d="M23.8,11.3v0.1h0.1h3.5c0.2,0,0.4,0.2,0.4,0.4v2.5c0,0.2-0.2,0.4-0.4,0.4h-1h-0.1v0.1v11c0,0.2-0.2,0.4-0.4,0.4  h-12c-0.2,0-0.4-0.2-0.4-0.4v-11v-0.1h-0.1h-2.7c-0.2,0-0.4-0.2-0.4-0.4v-2.5c0-0.2,0.2-0.4,0.4-0.4h3.5h0.1v-0.1v-1.2  c0-1.6,1.3-2.9,2.9-2.9h3.6c1.6,0,2.9,1.3,2.9,2.9V11.3z M22.8,11.4H23v-0.1v-1.2C23,9,22,8.1,20.9,8.1h-3.6c-1.1,0-2.1,0.9-2.1,2.1  v1.2v0.1h0.1H22.8z M25.3,25.5h0.1v-0.1V14.9v-0.1h-0.1H14.5h-0.1v0.1v10.5v0.1h0.1H25.3z M26.9,13.9H27v-0.1v-1.3v-0.1h-0.1h-3.5  h-8.6h-3.5h-0.1v0.1v1.3v0.1h0.1h2.7h12H26.9z"/>
<path class="st0" d="M19.1,0.1c1.6,0,3,1.3,3,3c0,1.6-1.3,3-3,3c-1.6,0-3-1.3-3-3S17.5,0.1,19.1,0.1z M19.1,1C17.9,1,17,1.9,17,3.1  s0.9,2.1,2.1,2.1c1.1,0,2.1-0.9,2.1-2.1S20.2,1,19.1,1z"/>
<g>
	<path class="st0" d="M12.5,25.9c-0.8-2.9-1.5-5.8-2.3-8.7c-0.2-0.9-0.8-1.4-1.7-1.6c-0.1,0-0.3,0-0.4,0v-0.2c0-1.6,0-3.2,0-4.8   c0-1-0.3-1.8-1-2.4C6,7.3,4.4,7.1,3.3,7.7c-1.1,0.6-1.7,1.6-1.7,2.9c0,1.3,0,2.6,0,4c0,0.3,0.1,0.7,0.1,1c0.2,0.7,0.6,1.2,1,1.7   c0.1,0.1,0.1,0.1,0.2,0.2H2.8c-0.8,0-1.6,0-2.3,0c-0.3,0-0.4,0.1-0.4,0.4c0,2.7,0,5.4,0,8.2c0,0.3,0.1,0.4,0.4,0.4   c2.4,0,4.8,0,7.2,0c0.3,0,0.4-0.1,0.4-0.4c0-0.2,0-0.5,0-0.7c0,0,0-0.1,0.1-0.1c0.1,0,0.3-0.1,0.4-0.1c0.1,0.4,0.3,0.7,0.4,1   c0.1,0.2,0.2,0.3,0.4,0.3c0.9,0,1.8,0,2.7,0C12.4,26.4,12.5,26.2,12.5,25.9z M7.5,25.7C7.5,25.7,7.5,25.7,7.5,25.7l-6.7,0.1v-7.6   h0.2c1.6,0,3.3,0,4.9,0c0.1,0,0.2,0,0.2,0.1C6.5,19.5,7,20.7,7.4,22c0,0,0,0.1,0,0.2C7.5,23.3,7.5,24.5,7.5,25.7z M11.6,25.8   c-0.6,0-1.3,0-1.9,0c-0.1,0-0.1,0-0.2-0.1C9,24.4,8.6,23.2,8.1,22c-0.5-1.4-1-2.8-1.6-4.2c-0.1-0.3-0.2-0.3-0.5-0.3   c-0.4,0-0.9,0-1.3,0c-1.2-0.1-2.3-1.1-2.5-2.4c0-0.2,0-0.4,0-0.5c0-1.3,0-2.6,0-3.9c0-0.6,0.2-1.2,0.6-1.7c0.9-1.1,2.6-1.2,3.6-0.2   c0.6,0.5,0.9,1.2,0.9,2c0,1.8,0,3.5,0,5.3c0,0.3,0.1,0.4,0.4,0.4c0.3,0,0.6,0,0.9,0.1c0.5,0.2,0.8,0.5,0.9,1   c0.7,2.7,1.4,5.5,2.2,8.2c0,0,0,0.1,0,0.1H11.6z"/>
</g>
</svg>`;
  return <SvgFromXml xml={xml} />;
};
export default WorkSpaceSvg;
