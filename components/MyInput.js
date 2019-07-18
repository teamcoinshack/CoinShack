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
      inputContainerStyle={{
        ...styles.container,
        width: props.width,
      }}
      inputStyle={{
        ...styles.text,
        textAlign: props.textAlign,
      }}
      rightIconContainerStyle={styles.rightIconContainer}
      autoCapitalize={props.autoCapitalize}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType}
      // either Icon or Text
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
      rightIcon={props.customRightButton ||
        (props.rightText
          ? <Text style={styles.sideText}>
              {props.rightText}
            </Text>
          : null)
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
  customRightButton: null,
  textAlign: "left",
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderColor: '#515360',
    borderWidth: 2,
    borderBottomWidth: 2,
    marginVertical: 10,
  },
  text: {
    textAlign: 'left',
    fontSize: 20,
    color: '#ffffff',
    padding: 10,
  },
  sideText: {
    color: "#999999",
    fontSize: 20,
  },
  rightIconContainer: {
    marginLeft: 2,
    marginRight: 15,
  }
})
