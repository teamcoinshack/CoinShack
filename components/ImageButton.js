import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  View,
  Image,
} from 'react-native';

export default ImageButton = props => {
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
          <Image
            source={props.path}
            style={styles.imageStyle}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
} 

ImageButton.defaultProps = {
  textColor: "#ffffff",
  height: 65,
  width: "100%",
}

const styles = StyleSheet.create({
  button: {
    elevation: 1,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  imageStyle: {
    height: 40,
    width: '150%',
  }
});
