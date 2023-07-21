import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async key => await AsyncStorage.getItem(key);
export const setData = async (key, data) =>
  await AsyncStorage.setItem(key, data);
export const clearData = async key => await AsyncStorage.clear(key);
