import React from 'react';
import { Text } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const ResponsiveText = props => {
    return (
        <Text
       
            {...props}
            style={{
                ...props.style,
                fontSize: RFPercentage(props.size) || 14,
                color: props.color || '#ccc',
                fontFamily: props.weight || 'Inter-Regular',
            }}>

            {props.text}
        </Text>
    );
};

export default React.memo(ResponsiveText);