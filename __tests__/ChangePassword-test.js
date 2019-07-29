/**
 * @format
 */

import 'react-native';
import React from 'react';
import ChangePassword from '../screens/ChangePassword.js';
import Firebase from 'firebase';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

beforeAll(async function() {
  try {
    await Firebase.initializeApp({
      apiKey: "AIzaSyCowZ18HHJ1C2uIrbQqOtuzjEmGSwQ3neM",
      authDomain: "coinshack-533be.firebaseapp.com",
      databaseURL: "https://coinshack-533be.firebaseio.com",
      projectId: "coinshack-533be",
      storageBucket: "coinshack-533be.appspot.com",
      messagingSenderId: "1059449383508",
      appId: "1:1059449383508:web:d79145db316a5dfe" 
    });
    await Firebase.auth().signInWithEmailAndPassword(
      'e0308993@u.nus.edu',
      'Test123'
    )
  } catch (error) {
    console.log(error);
  }
});
jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  const tree = renderer.create(<ChangePassword />).toJSON();
  expect(tree).toMatchSnapshot();
});
