import React, {Component} from 'react';
import {
  Text, 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  FlatList, 
  Button,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import Firebase from 'firebase';
import q from './Query.js';

export default class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      news: [], 
      refreshing: false,
    }

    this.load = this.load.bind(this);
    this.refresh = this.refresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }
  
  load(url) {
    this.props.navigation.navigate('InternalWebpage', {url: url});  
  }

  async refresh() {
    try {
      let articles = await q.getNews();
      articles = articles.filter(article =>
        (article.title.includes("oin") || article.title.includes("rypto"))
      )
      let count = 0;
      articles.map(function(x) {
        x.listId = count.toString();
        count++;
        return x;
      })
      this.setState({
        news: articles,
        refreshing: false,
      });
    } catch(error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        id: Firebase.auth().currentUser.uid,
        refreshing: true,
      });
      await this.refresh();
    } catch(error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    return (
      <TouchableOpacity 
        style={styles.row}
        onPress={() => this.load(item.url)}
      >
        <View style={{ flexDirection: 'row' , justifyContent: 'center',}}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.urlToImage }}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.textStyle}>
            <Text style={{ fontSize: 18 }} >{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if (this.state.refreshing) {
      return (
        <View>
          <ActivityIndicator color="#4a4d51" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatStyle}
          data={this.state.news}
          renderItem={this.renderRow}
          keyExtractor={item => item.listId}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#99c0ff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  textStyle: {
    flex: 1,
    paddingLeft: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  flatStyle: {
    marginTop: 20,
  },
});
