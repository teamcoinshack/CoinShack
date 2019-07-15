import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import db from '../Database.js';
import Searchbar from '../components/Searchbar.js';

const background = '#373b48';

export default class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
      loading: false,
      query: '',
      callback: null,
    }
    this.fastLoad = this.fastLoad.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.load = this.load.bind(this);
  }

  load(friend) {
    this.props.navigation.navigate('FriendsProfile',{
      uid: this.state.uid,
      friendName: friend.username,
      friendUid: friend.uid,
      friendEmail: friend.email,
      callback: this.state.callback,
    })
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const callback = navigation.getParam('callback', null);
      this.setState({
        callback: callback,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fastLoad(query) {
    try {
      this.setState({
        loading: true,
        query: query,
      });
      if (query === '') {
        this.setState({
          results: [],
          loading: false,
        })
        return;
      }
      let res = await db.search(query);
      res = await Promise.all(
                    res.map(async function(uid) {
                      try {
                        let obj = {};
                        const snap = await db.getData(uid);
                        const snapped = snap.val();
                        obj.uid = uid;
                        obj.username = ('username' in snapped) 
                                        ? snapped.username
                                        : 'No name :(';
                        obj.email = snapped.email;
                        obj.title_id = snapped.title_id
                        obj.image = require('../assets/icons/noPic.png');
                        return obj;
                      } catch(error) {
                        console.log(error);
                      }
                    })
                  )
      this.setState({
        results: res,
      }, () => this.setState({
          loading: false,   
        })
      );
    } catch(error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    return ( 
      <TouchableOpacity
        style={styles.row}
        onPress={() => this.load(item)}
      >
        <Avatar
          rounded
          source={item.image}
          style={styles.imageStyle}
        />
        <View style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginLeft: 10,
        }}>
          <Text style={styles.text1}>{item.username}</Text>
          <Text style={styles.text2}>{item.email}</Text>
          <Title title_id={item.title_id} />
        </View>
      </TouchableOpacity>
    )
  }
  
  render() {
    const loading = (
      <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
            flexStart={true}
          />
      </View>
    )
    const searchResults = (
      <FlatList
        style={styles.flatStyle}
        data={this.state.results}
        renderItem={this.renderRow}
        keyExtractor={item => item.uid}
      />
    )
    const noResults = (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        marginTop: 20,
      }}>
        <Text style={{
          color: '#7c7c7c',
          fontWeight: '500',
          fontSize: 23,
        }}>
          No results
        </Text>
      </View>
    )
    return (
      <View style={styles.container}>
        <Searchbar 
          onChangeText={query => this.fastLoad(query)}
          search={this.state.query}
          removeText={() => this.setState({ query: '', results: [] })}
        />
        {this.state.loading
          ? loading
          : this.state.results.length === 0
            ? noResults
            : searchResults}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
    alignItems: 'center',
  },
  flatStyle: {
    marginTop: 10,
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginTop: 0,
    marginBottom: 6,
    width: Math.round(Dimensions.get('window').width - 28),
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  text1: {
    fontSize: 20,
    color: '#dbdbdb',
    fontWeight: '600',
  },
  text2: {
    fontSize: 14,
    color: '#a4a9b9',
    fontWeight: '500',
    marginBottom: 5,
  },
  text3: {
    fontSize: 20,
    color: '#faed27',
  }
});
