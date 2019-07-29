/**
 * @format
 */

import 'react-native';
import React from 'react';
import BadgesInfo from '../screens/BadgesInfo.js';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const mockFunction = (param) => {
  return {
    have1friend: true,
    spent10000atOnce: true,
  }
}
const createTestProps = (props: Object) => ({
  navigation: {
    navigate: jest.fn(),
    getParam: mockFunction,
  },
  ...props
});

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  let props: any;
  props = createTestProps({});
  const tree = renderer.create(<BadgesInfo {...props}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
