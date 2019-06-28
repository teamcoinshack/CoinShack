import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  View,
  Image,
} from 'react-native';

export default MyButton = props => {
  const image = (
    <Image 
      source={props.path}
      style={styles.imageStyle}
    />
  );
  return (
    <View style={{height: props.height, width: props.width}}>
      <TouchableOpacity
        style={styles.button}
        onPress={props.onPress}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
          {props.image ? image : null}
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
         <Text 
            style={{ 
              color: props.textColor, 
              fontSize: 20, 
              fontWeight: '700' 
            }}>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  imageStyle: {
    height: 45,
    width: 45,
  }
});