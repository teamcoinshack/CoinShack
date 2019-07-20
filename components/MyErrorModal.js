import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';
import MyButton from './MyButton.js';

export default MyErrorModal = props => {
  return (
    <Overlay
      transparent={true}
      height={250}
      isVisible={props.visible}
      borderRadius={5}
      overlayBackgroundColor="#373b48"
      onBackdropPress={props.close}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.prompt}>{props.prompt}</Text>
        <MyButton
          text="OK"
          textColor="#ff077a"
          onPress={props.close}  
        />
      </View>
    </Overlay>
  );
}

MyErrorModal.defaultProps = {
  title: "Error",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#dbdbdb',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  prompt: {
    color: '#a4a9b9',
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
  }
})
