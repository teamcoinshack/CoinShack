import React from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Title from './Title.js';
//Required parameters are text, path, right(content)

export default ProfileTab = props => (
      <View 
        style={styles.row}
      >
        <View style={{ 
          flexDirection: 'row', 
        }}>
          <View style={styles.imageAndNameContainer}>
            <Avatar
              rounded
              source={props.path}
              style={styles.imageStyle}
            />
            <View style={{ 
              flexDirection: 'column',
              marginLeft: 20,
            }}>
              <Text style={{
                color: '#dbdbdb',    
                fontWeight: '500',
                fontSize: 25,
                marginBottom: 5,
              }}>{props.username}</Text>
              <Text style={{
                color: '#c2c2c2',
                fontWeight: '500',
                fontSize: 15,
                marginBottom: 5,
              }}>{props.email}</Text>
              <Title title_id={props.title_id} />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.info}>
            <Text style={styles.header}>Net Worth</Text>
            <View style={styles.border}>
              {props.refreshing
               ? ( <MyBar height={20} flexStart={true}/> )
               : ( <Text style={styles.value}>{props.value}</Text> )}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.info}>
            <Text style={styles.header}>Achievments</Text>
            <View style={styles.border}>
              <Text style={styles.value}>{props.achieveCount}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.info}>
            <Text style={styles.header}>Favourite Cryptocurrency</Text>
            <View style={styles.border}>
              {props.refreshing
               ? ( <MyBar height={20} flexStart={true}/> )
               : ( <Text style={styles.value}>{props.favourite}</Text> )}
            </View>
          </View>
        </View>
      </View>
);

ProfileTab.defaultProps = {
  textColor: "#ffffff",
  path: require('../assets/icons/noPic.png'),
  title_id: null,
  username: 'Bob',
  achieveCount: 0,
  favourite: 'Bitcoin',
  value: -1,
}

const styles = StyleSheet.create({
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginTop: 0,
    marginBottom: 6,
    width: Math.round(Dimensions.get('window').width - 28),
  },
  imageAndNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  cashName: {
    paddingLeft: 18,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
    color: '#dbdbdb', 
    fontWeight: '600',
  },
  info: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  header: {
    fontSize: 23,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    color: '#a3a3a3',
    fontWeight: '500',
  },
  border: {
    alignItems: 'flex-start',
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: 0,
    width: Math.round(Dimensions.get('window').width * 0.7),
    marginBottom: 5,
  }
});
