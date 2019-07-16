import React from 'react';
import MyInput from '../components/MyInput.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default Searchbar = props => {
  return (
    <MyInput
      placeholder="Search by email/username"
      value={props.search}
      onChangeText={props.onChangeText}
      leftIconName="magnify"
      customRightButton={
        <Icon
          name="close"
          size={20}
          color={'#999999'}
          onPress={props.removeText}
        />
      }
      width="100%"
    />
  );
}

