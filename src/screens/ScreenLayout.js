import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import DraggableIcon from '../components/DraggableIcon';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

const ScreenLayout = () => {
  const navigation = useNavigation();
  const [baseball, setBaseball] = useState(false);

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.container}>
        <View style={styles.draggableIconContainer}>
          <View style={styles.container}>
            <DraggableIcon baseball={baseball} />
          </View>
        </View>
        <View style={styles.iconBox}>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.addActionButton}
              onPress={() =>
                navigation.navigate('Action', {container: 'action1'})
              }>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../assets/sprite.png')}
                  style={styles.imageDimension}
                />
              </View>
              <Text style={styles.buttonText}>Add Actions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.addActionButton}
              onPress={() => {
                setBaseball(true);
                navigation.navigate('Action', {container: 'action2'});
              }}>
              <View style={styles.imageContainer}>
                {baseball ? (
                  <Image
                    source={require('../assets/baseball.png')}
                    style={styles.imageDimension}
                  />
                ) : (
                  <Entypo name="squared-plus" size={100} color={'blue'} />
                )}
              </View>
              {baseball && <Text style={styles.buttonText}>Add Actions</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  draggableIconContainer: {
    flex: 0.8,
    position: 'relative',
  },
  resetButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    zIndex: 1,
  },
  resetButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  iconBox: {
    backgroundColor: '#ffffff',
    flex: 0.2,
    flexDirection: 'row',
  },
  actionContainer: {
    flex: 0.5,
    margin: 10,
  },
  addActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    padding: 10,
    backgroundColor: '#0bff0b',
    borderWidth: 1,
  },
  imageContainer: {
    borderWidth: 1,
    alignItems: 'center',
  },
  imageDimension: {
    height: 70,
    width: 70,
  },
});

export default ScreenLayout;
