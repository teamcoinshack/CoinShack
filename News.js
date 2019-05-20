import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Button } from 'react-native';
import Firebase from 'firebase';

export default class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
    }
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.setState({id: Firebase.auth().currentUser.uid});
  }

  logout() {
    Firebase.auth()
            .signOut()
            .then(() => (this.props.navigation.navigate('Login')))
            .catch(function(error) {
              alert(error.code);
            })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>News here</Text>
        <Button
          onPress={this.logout}
          title="Logout"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});
