import React from 'react';
import { Bar } from 'react-native-progress';
import { View } from 'react-native';

const background = '#373b48';
export default MyBar = props => {
  return (
    <View style={{
      height: props.height, 
      width: props.width,
      justifyContent: 'center',
      alignItems: props.flexStart ? 'flex-start' : 'center',
    }}>
      <Bar 
        color="#80e7a5" 
        animated={true}
        progress={0.3}
        width={250}
        indeterminate={true}
        borderWidth={0}
      >
      </Bar>
    </View>
  );
} 
