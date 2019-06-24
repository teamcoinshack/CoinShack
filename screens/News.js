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
  Dimensions,
} from 'react-native';
import Firebase from 'firebase';
import q from '../Query.js';
import MyBar from '../components/MyBar.js';

const background = '#373b48';
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
    this.onRefresh = this.onRefresh.bind(this);
    this.timePublished = this.timePublished.bind(this);
  }
  
  load(url) {
    this.props.navigation.navigate('InternalWebpage', {url: url});  
  }

  onRefresh() {
    this.setState({
      refreshing: true,
    }, function() { this.refresh() })
  }

  async refresh() {
    try {
      let articles = await q.getNews();
      articles = articles.filter(article =>
        (article.title.includes("oin") 
          || article.title.includes("rypto"))
      )
      names = [];
      newArticles = [];
      articles.forEach(function(x) {
        if (!names.includes(x.title)) {
          names.push(x.title);
          newArticles.push(x);
        }
      });
      articles = newArticles;
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

  timePublished(date) {
    const published = new Date(date);
    const now = new Date();
    const milis = now.getTime();
    const hour = Math.round((milis - published) / 3600000);
    if (hour === 0) {
      return 'now';
    }
    if (hour === 1) {
      return '1 hour ago';
    }
    return hour + ' hours ago';
  }

  renderRow({item}) {
    return (
      <TouchableOpacity 
        style={styles.row}
        onPress={() => this.load(item.url)}
      >
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center',
        }}>
          <View style={styles.imageContainer}>
            { item.urlToImage === null 
              ? (
                <Image
                  source={require('../assets/icons/news.png')}
                  style={styles.imageStyle}
                />
              )
              : (
                <Image
                  source={{ uri: item.urlToImage}}
                  style={styles.imageStyle}
                />
              )
            }
          </View>
          <View style={styles.textStyle}>
            <Text style={{ 
              fontSize: 18, 
              color: '#bec4d8', 
              fontWeight: '500' 
            }}>
              {item.title}
            </Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 5,
        }}>
          <View style={styles.sourceStyle}>
            <Text style={{
              fontSize: 13,
              color: '#9196a5',
              fontWeight: '700',
            }}>
              {item.source.name.toUpperCase().slice(-4) === '.COM'
                ? item.source.name.toUpperCase().slice(0, -4).replace(/ /g, '')
                : item.source.name.toUpperCase().replace(/ /g, '')}
            </Text>
          </View>
          <View style={styles.timeStyle}>
            <Text style={{
              fontSize: 15,
              color: '#9196a5',
              fontWeight: '600',
            }}>{this.timePublished(item.publishedAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if (this.state.news.length === 0) {
      return (
        <View style={styles.loadingStyle}>
          <MyBar
            height={Math.round(Dimensions.get('window').height)}
            width={Math.round(Dimensions.get('window').width)}
          />
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
  sourceStyle: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  timeStyle: {
    flex: 1,
    alignItems: 'flex-end',
  },
  loadingStyle: {
    flex: 1,
    backgroundColor: background,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flexDirection: 'column',
    width: Math.round(Dimensions.get('window').width) - 28, 
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 13,
    paddingLeft: 18,
    paddingRight: 18,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 12,
  },
  imageContainer: {
    justifyContent: 'center',
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
    backgroundColor: background,
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  flatStyle: {
    marginTop: 20,
  },
});
