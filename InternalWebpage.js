import React from 'react';
import { WebView} from 'react-native'

export default class InternalWebpage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const url = navigation.getParam('url', null);
    this.setState({
      url: url,
    });
  }

  render() {
    return (
      <WebView
        source={{ uri: this.state.url }}
        style={{ marginTop: 20 }}
      />
    );
  }
}
