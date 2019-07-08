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
import { List, ListItem } from 'react-native-elements';
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
      
    }
    this.fastLoad = this.fastLoad.bind(this);
  }

  async componentDidMount() {

  }
  
  fastLoad(query) {
    db.search(query);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Searchbar 
          onChangeText={query => this.fastLoad(query)}
          search={this.state.query}
        />
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
});
