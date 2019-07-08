import React, {Component} from 'react';
import {
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import db from '../Database.js';
import q from '../Query.js';
import Masterlist from '../Masterlist.js';
import Searchbar from '../components/Searchbar.js';

const background = '#373b48';

export default class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
      loading: false,
    }
    this.fastLoad = this.fastLoad.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  async fastLoad(query) {
    try {
      this.setState({
        loading: true,
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
                        obj.uid = uid;
                        obj.username = ('username' in snap.val())
                                        ? snap.val().username
                                        : 'No name :(';
                        obj.email = snap.val().email;
                        obj.title = ('title' in snap.val())
                                      ? snap.val().title
                                      : 'Novice';
                        obj.image = require('../assets/icons/noPic.png');
                        return obj;
                      } catch(error) {
                        console.log(error);
                      }
                    })
                  )
      console.log(res);
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
        onPress={() => this.load(item.uid)}
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
          <Text>{item.username}</Text>
          <Text>{item.email}</Text>
          <Text>{item.title}</Text>
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
  }
});
