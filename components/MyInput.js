import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; //

export default MyInput = props => {
  return (
    <Input
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      placeholderTextColor="#999999"
      inputContainerStyle={{ ...styles.container, width: props.width }}
      inputStyle={styles.text}
      autoCapitalize={props.autoCapitalize}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType}
      leftIcon={
        props.leftIconName
          ? <Icon
              name={props.leftIconName}
              size={26}
              color="#999999"
            />
          : props.leftText
            ? <Text style={styles.sideText}>
                {props.leftText}
              </Text>
            : null
      }
      rightIcon={
        props.rightText
          ? <Text style={styles.sideText}>
              {props.rightText}
            </Text>
          : null
      }
    />
  );
}

MyInput.defaultProps = {
  value: "",
  onChangeText: () => {},
  placeholder: "",
  leftIconName: "",
  leftText: "",
  rightText: "",
  autoCapitalize: "none",
  secureTextEntry: false,
  keyboardType: "default",
  width: (Dimensions.get('window').width) * 0.7,
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    elevation: 1,
    borderBottomColor: '#515360',
    borderBottomWidth: 3,
    margin: 10  ,
  },
  text: {
    textAlign: 'left',
    fontSize: 20,
    color: '#ffffff',
    paddingHorizontal: 10,
  },
  sideText: {
    color: "#999999",
    fontSize: 20,
  }
})