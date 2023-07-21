import React from 'react';
import StackNavigation from './navigation/StackNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StackNavigation />
    </GestureHandlerRootView>
  );
};

export default App;
