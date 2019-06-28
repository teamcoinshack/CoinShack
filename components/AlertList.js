import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  View,
  Image,
} from 'react-native';

export default class AlertList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: this.props.symbol,
      currentlyOpenItem: null,
    };
    this.renderRow = this.renderRow.bind(this);
  }
  
  closeOpenItem = () => {
    const {currentlyOpenItem} = this.state;

    if (currentlyOpenItem !== null) {
      currentlyOpenItem.recenter()
    }
  };

  renderRow({item}) {
    const rightButtons = [
      <TouchableOpacity
        style={styles.deleteButton}
        onPress{() => this.deleteAlert(item.index)}
      >
        <Image
          source={require('../assets/icons/trash.png')}
          style={styles.imageStyle}
        />
      </TouchableOpacity>
    ]
    const direction = item.notifyWhenAbove ? 'above' : 'below';

    return (
      <Swipeable
        rightButtons={rightButtons}
      >
        <View style={styles.alertRow}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={styles.alertDetail}>
              {this.state.symbol} is {' ' + direction + db.stringify(item.price)}
            </Text>
          </View>
        </View>
      </Swipeable>
    )
  }

  render() {
    const {currentlyOpenItem} = this.state;

    return (
      <FlatList
        data={this.props.alerts}
        renderItem={this.renderRow}
        keyExtractor={item => item.index}
      />
    )
  }
} 
