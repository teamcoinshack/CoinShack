import React from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default Searchbar = props => (
  <View style={styles.inputContainer}>
    <Icon
      name="magnify"
      size={24}
      color={'#ffffff'}
    />
    <TextInput
      style={styles.textInput}
      autoCapitalize="none"
      placeholder=" Search by email/username"
      placeholderTextColor="#999999"
      onChangeText={props.onChangeText}
      value={props.search}
    />
    <TouchableOpacity
      onPress={props.removeText}
    >
      <Icon
        name="close"
        size={24}
        color={'#ffffff'}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#515360',
    borderBottomWidth: 3,
    width: Math.round(Dimensions.get('window').width * 0.8),
    alignItems: 'center',
    marginBottom: 6,
  },
  textInput: {
    flex: 1,
    elevation: 1,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    marginLeft: 5,
    fontSize: 20,
    color: '#ffffff',
  },
});
