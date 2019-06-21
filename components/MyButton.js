import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

export default MyButton = props => {
  return (
    <View style={{height: props.height, width: props.width}}>
      <TouchableOpacity
        style={styles.button}
        onPress={props.onPress}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={{ color: props.textColor, fontSize: 20, fontWeight: '700' }}>
            {props.text}
          </Text> 
        </View>
      </TouchableOpacity>
    </View>
  );
} 

MyButton.defaultProps = {
  textColor: "#ffffff",
  height: 65,
  width: "100%",
}

const styles = StyleSheet.create({
  button: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 10,
  },
});