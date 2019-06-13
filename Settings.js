import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Button } from 'react-native';
import Firebase from 'firebase';

const background = '#373b48';
export default class Settings extends Component {
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
        <Text>Settings</Text>
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
    backgroundColor: background,
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});
