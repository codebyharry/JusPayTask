import React, {useRef, useState, useImperativeHandle, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  PanResponder,
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {clearData, getData} from '../constants/AsyncData';

const DraggableIcon = (props, ref) => {
  const [lastOffset, setLastOffset] = useState({x: 0, y: 0});
  const draggableIconRef = useRef();
  const pan1 = useRef(new Animated.ValueXY()).current; // For the first image
  const pan2 = useRef(new Animated.ValueXY()).current; // For the second image
  const [action, setAction] = useState([]);
  const [action2, setAction2] = useState([]);
  const [increaseBaseBall, setIncreaseBaseBall] = useState(false);
  const [increaseSprite, setIncreaseSprite] = useState(false);
  const [decreaseBaseBall, setDecreaseBaseBall] = useState(false);
  const [decreaseSprite, setDecreaseSprite] = useState(false);
  const [hello, setHello] = useState(false);
  const [baseBallHello, setBaseBallHello] = useState(false);
  const isFocused = useIsFocused();
  const panRef = useRef({x: 0, y: 0});
  const rotationValue = useRef(new Animated.Value(0)).current;
  const rotationValue2 = useRef(new Animated.Value(0)).current;
  const {baseball} = props;

  const handlePlay = async () => {
    if (baseball && action2.length > 0 && action === null) {
      handleAnimation(action2, 'action2');
    } else if (baseball && action2.length > 0 && action.length > 0) {
      handleAnimation(action2, 'action2');
      handleAnimation(action, 'action1');
    } else if (baseball && action.length > 0 && action2.length === 0) {
      handleAnimation(action, 'action1');
    } else {
      handleAnimation(action, 'action1');
    }
  };

  const handleAnimation = (data, actionTab) => {
    if (data) {
      const animations = [];
      let repeat = false;

      for (let i = 0; i < data.length; i++) {
        const x = data[i].text;
        if (x === 'Move X By 50') {
          panRef.current = {
            x: panRef.current.x + 50,
            y: panRef.current.y,
          };
          animations.push(
            Animated.spring(actionTab === 'action1' ? pan1 : pan2, {
              toValue: {x: panRef.current.x, y: panRef.current.y},
              useNativeDriver: false,
            }),
          );
        } else if (x === 'Move Y By 50') {
          panRef.current = {
            x: panRef.current.x,
            y: panRef.current.y + 50,
          };
          animations.push(
            Animated.spring(actionTab === 'action1' ? pan1 : pan2, {
              toValue: {x: panRef.current.x, y: panRef.current.y},
              useNativeDriver: false,
            }),
          );
        } else if (x === 'Rotate 360') {
          if (actionTab === 'action1') {
            const rotationAnimation = Animated.timing(rotationValue, {
              toValue: 360,
              useNativeDriver: false,
            });
            animations.push(rotationAnimation);
          } else {
            const rotationAnimation = Animated.timing(rotationValue2, {
              toValue: 360,
              useNativeDriver: false,
            });
            animations.push(rotationAnimation);
          }
        } else if (x === 'Repeat') {
          repeat = true;
          break;
        } else if (x === 'Say Hello') {
          if (actionTab === 'action1') {
            setHello(true);
          } else {
            setBaseBallHello(true);
          }
          setTimeout(() => {
            setHello(false);
            setBaseBallHello(false);
          }, 5000);
        } else if (x === 'Increase Size') {
          if (actionTab === 'action1') {
            setIncreaseSprite(true);
          } else {
            setIncreaseBaseBall(true);
          }
        } else if (x === 'Decrease Size') {
          if (actionTab === 'action1') {
            setDecreaseSprite(true);
          } else {
            setDecreaseBaseBall(true);
          }
        }
      }

      const moveAnimation = Animated.sequence(animations);

      moveAnimation.start(() => {
        if (repeat) {
          Animated.loop(moveAnimation, {iterations: 1}).start();
        }
      });
    }
  };

  const panResponder1 = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        pan1.setValue({
          x: gesture.dx + lastOffset.x,
          y: gesture.dy + lastOffset.y,
        });
      },
      onPanResponderGrant: () => {
        pan1.setOffset({
          x: pan1.x._value,
          y: pan1.y._value,
        });
        pan1.setValue({x: 0, y: 0});
      },
      onPanResponderRelease: () => {
        pan1.flattenOffset();
        setLastOffset({x: pan1.x._value, y: pan1.y._value});
      },
    }),
  ).current;

  const panResponder2 = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        pan2.setValue({
          x: gesture.dx + lastOffset.x,
          y: gesture.dy + lastOffset.y,
        });
      },
      onPanResponderGrant: () => {
        pan2.setOffset({
          x: pan2.x._value,
          y: pan2.y._value,
        });
        pan2.setValue({x: 0, y: 0});
      },
      onPanResponderRelease: () => {
        pan2.flattenOffset();
        setLastOffset({x: pan2.x._value, y: pan2.y._value});
      },
    }),
  ).current;

  useImperativeHandle(draggableIconRef, () => ({
    resetPosition: () => {
      Animated.spring(pan1, {
        toValue: {x: 0, y: 0},
        useNativeDriver: false,
      }).start();
      Animated.spring(pan2, {
        toValue: {x: 0, y: 0},
        useNativeDriver: false,
      }).start();
      setLastOffset({x: 0, y: 0});
    },
  }));

  const data = async () => {
    const a1 = await getData('action1');
    const a2 = await getData('action2');
    setAction(JSON.parse(a1));
    setAction2(JSON.parse(a2));
  };

  const resetIconPosition = async () => {
    if (draggableIconRef.current) {
      await clearData();
      panRef.current = {
        x: 0,
        y: 0,
      };
      setAction([]);
      setAction2([]);
      setHello(false);
      setIncreaseBaseBall(false);
      setDecreaseBaseBall(false);
      setIncreaseSprite(false);
      setDecreaseSprite(false);
      draggableIconRef.current.resetPosition();
    }
  };

  useEffect(() => {
    data();
  }, [isFocused]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.resetButtonContainer}>
        <TouchableOpacity onPress={resetIconPosition}>
          <Icon name="refresh" size={30} color="blue" />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Animated.View
          {...panResponder1.panHandlers}
          style={{
            transform: [
              {translateX: pan1.x},
              {translateY: pan1.y},
              {
                rotate: rotationValue.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
              {scale: increaseSprite ? 1.5 : decreaseSprite ? 0.5 : 1},
            ],
          }}>
          <Image
            source={
              hello
                ? require('../assets/sprite_hello.png')
                : require('../assets/sprite.png')
            }
            style={[styles.imageDimensions]}
          />
        </Animated.View>
        {baseball && (
          <Animated.View
            {...panResponder2.panHandlers}
            style={{
              transform: [
                {translateX: pan2.x},
                {translateY: pan2.y},
                {
                  rotate: rotationValue2.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
                {scale: increaseBaseBall ? 1.5 : decreaseBaseBall ? 0.5 : 1},
              ],
            }}>
            <Image
              source={
                baseBallHello
                  ? require('../assets/baseball_hello.png')
                  : require('../assets/baseball.png')
              }
              style={styles.imageDimensions}
            />
          </Animated.View>
        )}
      </View>
      <View style={styles.xAxisContainer}>
        <Text style={styles.coordinatesText}>X</Text>
        <Text style={styles.coordinatesContainer}>
          {lastOffset.x.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity style={styles.playButtonContainer} onPress={handlePlay}>
        <Icon name="play-circle" size={40} color={'green'} />
      </TouchableOpacity>
      <View style={styles.yAxisContainer}>
        <Text style={styles.coordinatesText}>Y</Text>
        <Text style={styles.coordinatesContainer}>
          {lastOffset.y.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default DraggableIcon;

const styles = StyleSheet.create({
  playButtonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    zIndex: 1,
  },
  resetButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  imageDimensions: {
    height: 150,
    width: 150,
    backgroundColor: 'transparent',
  },
  xAxisContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 1,
    flexDirection: 'row',
  },
  yAxisContainer: {
    position: 'absolute',
    bottom: 10,
    zIndex: 1,
    flexDirection: 'row',
  },
  coordinatesText: {
    fontWeight: '700',
    padding: 5,
  },
  coordinatesContainer: {
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 5,
  },
});
