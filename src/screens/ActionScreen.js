import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import Draggable from 'react-native-draggable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {data} from '../constants/Data';
import {getData, setData} from '../constants/AsyncData';

const ActionScreen = () => {
  const [column1, setColumn1] = useState(data);
  const [column2, setColumn2] = useState([]);
  const [action1, setAction1] = useState([]);
  const [action2, setAction2] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const {container} = route.params;
  const [selectedAction, setSelectedAction] = useState(container.toLowerCase());

  const renderItem = ({item, columnIndex}) => {
    return (
      <View style={styles.itemContainer}>
        <Draggable
          renderSize={60}
          renderColor="pink"
          shouldReverse
          onDragRelease={(event, gestureState) => onDragEnd(item, columnIndex)}>
          <Text style={styles.draggableText}>{item.text}</Text>
        </Draggable>
      </View>
    );
  };

  const onDragEnd = (item, columnIndex) => {
    if (columnIndex === 1) {
      // Dragging from the "Code" column
      setColumn1(prevColumn => prevColumn.filter(e => e.id !== item.id));
      if (selectedAction === 'action1') {
        setAction1(prevAction => [...prevAction, item]);
      } else if (selectedAction === 'action2') {
        setAction2(prevAction => [...prevAction, item]);
      } else {
        setColumn2(prevColumn => [...prevColumn, item]);
      }
    } else if (columnIndex === 2) {
      // Dragging from the "SelectedAction" column back to "Code" column
      setColumn2(prevColumn => prevColumn.filter(e => e.id !== item.id));
      setColumn1(prevColumn => prevColumn.filter(e => e.id !== item.id));
    } else if (columnIndex === 3) {
      // Dragging from "Action1" column back to "Code" column
      setAction1(prevAction => prevAction.filter(e => e.id !== item.id));
      setColumn1(prevColumn => [...prevColumn, item]);
    } else if (columnIndex === 4) {
      // Dragging from "Action2" column back to "Code" column
      setAction2(prevAction => prevAction.filter(e => e.id !== item.id));
      setColumn1(prevColumn => [...prevColumn, item]);
    }
  };

  const handleDone = async () => {
    if (action1.length > 0) {
      await setData('action1', JSON.stringify(action1));
      if (action2.length > 0) {
        await setData('action2', JSON.stringify(action2));
      }
      navigation.pop();
    } else if (action2.length > 0) {
      await setData('action2', JSON.stringify(action2)).then(() =>
        navigation.pop(),
      );
    } else {
      navigation.pop();
    }
  };

  const handleActionChange = newAction => {
    setSelectedAction(newAction.toLowerCase());

    // Restore the original data when switching between tabs
    if (newAction.toLowerCase() === 'action1') {
      setColumn2([...column2]);
      setAction1([]);
      setColumn1(data);
    } else if (newAction.toLowerCase() === 'action2') {
      setColumn2([...column1]);
      setAction2([]);
      setColumn1(data);
    }
  };

  const addData = async () => {
    const a1 = await getData('action1');
    const a2 = await getData('action2');
    if (a1) {
      setAction1(JSON.parse(a1));
    } else if (a2) {
      setAction2(JSON.parse(a2));
    }
  };

  useEffect(() => {
    addData();
  }, []);

  // Filter the data in the "Code" column
  const filteredColumn1 = column1.filter(
    item => !action1.some(actionItem => actionItem.id === item.id),
  );
  console.log(filteredColumn1);

  const filteredColumn2 = column1.filter(
    item => !action2.some(actionItem => actionItem.id === item.id),
  );

  return (
    <SafeAreaView style={styles.flexOne}>
      <View style={styles.container}>
        {/* Column 1 */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Code</Text>
          <FlatList
            data={container === 'action1' ? filteredColumn1 : filteredColumn2} // Use the filtered data here
            renderItem={({item}) => renderItem({item, columnIndex: 1})}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.itemsContainer}
          />
        </View>

        {/* Action Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Action Column</Text>
          <View style={styles.actionHeader}>
            <TouchableOpacity
              onPress={() => handleActionChange('action1')}
              style={[
                styles.actionHeaderItem,
                selectedAction === 'action1' && styles.actionHeaderItemSelected,
              ]}>
              <Text>Action 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleActionChange('action2')}
              style={[
                styles.actionHeaderItem,
                selectedAction === 'action2' && styles.actionHeaderItemSelected,
              ]}>
              <Text>Action 2</Text>
            </TouchableOpacity>
          </View>
          {selectedAction === 'action1' && (
            <>
              <FlatList
                data={action1}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.itemsContainer}
                renderItem={({item}) => renderItem({item, columnIndex: 3})}
              />
            </>
          )}
          {selectedAction === 'action2' && (
            <>
              <FlatList
                data={action2}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.itemsContainer}
                renderItem={({item}) => renderItem({item, columnIndex: 4})}
              />
            </>
          )}
          {selectedAction !== 'action1' && selectedAction !== 'action2' && (
            <FlatList
              data={filteredColumn2} // Use the filtered data here
              keyExtractor={item => item.id}
              contentContainerStyle={styles.itemsContainer}
              renderItem={({item}) => renderItem({item, columnIndex: 2})}
            />
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.alignCenter} onPress={handleDone}>
        <Text style={styles.doneButton}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    height: '90%',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemsContainer: {
    alignItems: 'center',
    flexGrow: 1,
    zIndex: 1,
  },
  itemContainer: {
    marginRight: 50,
    marginBottom: 10,
    padding: 20,
    zIndex: 1,
    position: 'relative',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionHeaderItem: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  actionHeaderItemSelected: {
    backgroundColor: 'pink',
    marginBottom: 10,
  },
  actionSubheading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  alignCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    backgroundColor: 'green',
    padding: 10,
    fontSize: 16,
  },
  flexOne: {
    flex: 1,
  },
  draggableText: {
    padding: 10,
    zIndex: 2,
  },
});

export default ActionScreen;
