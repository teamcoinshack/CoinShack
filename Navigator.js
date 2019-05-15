import React from 'react';
import {Platform, StyleSheet, Text, View, Button, TextInput} from 'react-native';

class Navigator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            user: '',
            pass: '',
        }
    }

    loginSuccess = () => {
        this.setState(prevState => ({
            id: prevState.id === 1 ? 2 : 1,
        }))
    }

    render() {
        if (this.state.id === 1) {
            return (
                <View>
                    <Text style={styles.welcome}>Welcome!</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.welcome}>Username:</Text>
                        <TextInput
                            style={styles.textBox}
                            onChangeText ={(user) => this.setState({user: user})}
                            placeholder='Username'
                            placeholderTextColor='#a5a5a5'
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.welcome}>Password:</Text>
                        <TextInput
                            style={styles.textBox}
                            onChangeText ={(pass) => this.setState({pass: pass})}
                            placeholder='Password'
                            placeholderTextColor='#a5a5a5'
                        />
                    </View>
                    <Button onPress={this.loginSuccess} title='Login' />
                </View>
            );
        } else if (this.state.id === 2) {
            return (
                <Text style={styles.welcome}>Insert graph here</Text>
            );
        }
    }
}

export default Navigator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBox: {
    fontSize: 20,
  },
});
