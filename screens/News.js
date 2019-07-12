import React, { Component } from 'react';
import {
  Text, 
  View,
  ScrollView,
  StyleSheet, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Firebase from 'firebase';
import q from '../Query.js';
import MyBar from '../components/MyBar.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import { coinTitles } from '../Masterlist.js';
import { CheckBox } from 'react-native-elements';

const background = '#373b48';

export default class News extends Component {
  constructor(props) {
    super(props);

    let coinFilters = coinTitles.reduce((acc, curr) => {
      return {...acc, [curr]: true};
    }, {});

    this.state = {
      id: '',
      news: [], 
      refreshing: false,
      allCrypto: true,
      ...coinFilters,
    }

    this.load = this.load.bind(this);
    this.refresh = this.refresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.timePublished = this.timePublished.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.renderFilterSheet = this.renderFilterSheet.bind(this);
    this.getCheckBoxOnPress = this.getCheckBoxOnPress.bind(this);
    this.toggleAllCrypto = this.toggleAllCrypto.bind(this);
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
      let topics = "";
      if (!(this.state.allCrypto)) { // get news of these cryptos only
        for (title of coinTitles) {
          if (this.state[title]) {
            topics += ("+" + title); // include this coin
          }
        }
      } else { // get news of all cryptos
        topics = "cryptocurrency";
      }

      let articles = await q.getNews(topics);

      titles = [];
      articles = articles.filter(x => {
        if (titles.includes(x.title)) {
          return false;
        } else {
          titles.push(x.title);
          return true;
        }
      });
      articles.forEach((x, index) => x.listId = "" + index);

      this.setState({
        news: articles,
        refreshing: false,
      });
    } catch(error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    this.props.navigation.setParams({ toggleFilter: this.toggleFilter });

    try {
      this.setState({
        id: Firebase.auth().currentUser.uid,
        refreshing: true,
      });
      await this.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  timePublished(date) {
    const published = new Date(date);
    const now = new Date();
    const milis = now.getTime();
    const hour = Math.round((milis - published) / 3600000);
    const day = Math.round((milis - published) / 86400000);
    if (hour === 0) {
      return 'now';
    } else if (hour === 1) {
      return '1 hour ago';
    } else if (hour < 24) {
      return hour + ' hours ago';
    } else if (day === 1) {
      return '1 day ago';
    } else {
      return day + ' days ago';
    }
  }

  // when allCrypto is false and toggled to true, set all coins to true
  // when allCrypto is true, only toggle itself to false
  toggleAllCrypto() {
    let newCoinStates = coinTitles.reduce((acc, curr) => {
      return {...acc, [curr]: !(this.state.allCrypto)};
    }, {});

    this.setState({
      allCrypto: !(this.state.allCrypto),
      ...newCoinStates,
    });
  }

  getCheckBoxOnPress(coinTitle) {
    return () => this.setState({ [coinTitle]: !this.state[coinTitle] });
  }

  toggleFilter() {
    this.RBSheet.open();
  }

  renderFilterSheet() {
    return (
      <RBSheet
        ref={ref => this.RBSheet = ref}
        height={Math.round(Dimensions.get('window').height) / 2 - 100}
        duration={250}
        onClose={this.refresh}
        customStyles={{
          container: {
            backgroundColor: background,
            alignItems: 'stretch',
          }
        }}
      >
        <ScrollView contentContainerStyle={styles.filterContainer}>
          <Text style={styles.filterSheetHeader}>
            Show news about
          </Text>
          <CheckBox
            title="All Cryptocurrencies"
            checked={this.state.allCrypto}
            onPress={this.toggleAllCrypto}
            containerStyle={{
              backgroundColor: "#515360",
              borderColor: "#515360",
            }}
            textStyle={{
              color: "#ffffff",
            }}
            checkedColor="#00f9ff"
          />
          {coinTitles.map((title, key) => {
             return (
              <CheckBox
                key={key}
                title={title}
                checked={this.state[title]}
                onPress={this.getCheckBoxOnPress(title)}
                containerStyle={{
                  backgroundColor: "#515360",
                  borderColor: "#515360",
                }}
                textStyle={{
                  color: "#ffffff",
                }}
                checkedColor="#00f9ff"
              />
            );
          })}
        </ScrollView>
      </RBSheet>
    );
  }

  renderRow({ item }) {
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
            { item.urlToImage === null || item.urlToImage === ''
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
      );
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
        {this.renderFilterSheet()}
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
    backgroundColor: '#515360',
    elevation: 1,
    borderRadius: 5,
    flexDirection: 'column',
    width: Math.round(Dimensions.get('window').width) - 28, 
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 13,
    paddingHorizontal: 18,
    marginHorizontal: 14,
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
  filterContainer: {
    marginVertical: 12,
    marginHorizontal: 4,
    paddingBottom: 20,
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  flatStyle: {
    marginTop: 20,
  },
  filterSheetHeader: {
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 7,
    color: '#dbdbdb',
    fontWeight: '500',
  },
});
