/**
 * @format
 */

import 'react-native';
import React from 'react';
import FriendsProfile from '../screens/FriendsProfile.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  const tree = renderer.create(<FriendsProfile />).toJSON();
  expect(tree).toMatchSnapshot();
});
