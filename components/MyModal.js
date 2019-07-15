import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';


// TODO
// not done
export default MyModal = props => {
  return (
    <Modal
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.container}>
        {props.text}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: "#373b48",
  }
})
