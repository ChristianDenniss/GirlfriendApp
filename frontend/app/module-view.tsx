
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, FlatList, TextInput, Pressable, Modal, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppState } from '@/state/AppState';
import { useState } from 'react';
import { AnimatedListItem } from '@/components/AnimatedListItem';
import { MaterialIcons } from '@expo/vector-icons';

export default function ModuleViewScreen() {
  const { id } = useLocalSearchParams();
  const { modules, addItemToModule, toggleItemComplete, clearCompletedItems, deleteAllItems } = useAppState();
  const module = modules.find(m => m.id === id);
  
  // Ensure module has items array
  const moduleWithItems = module ? {
    ...module,
    items: module.items || []
  } : null;
  const [newItemText, setNewItemText] = useState('');
  const [timeframeText, setTimeframeText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!moduleWithItems) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Module Not Found</ThemedText>
      </ThemedView>
    );
  }

  const handleAddItem = () => {
    if (newItemText.trim()) {
      if (moduleWithItems.type === 'bucketlist') {
        addItemToModule(moduleWithItems.id, newItemText.trim(), timeframeText.trim());
        setTimeframeText('');
      } else {
        addItemToModule(moduleWithItems.id, newItemText.trim());
      }
      setNewItemText('');
      setTimeframeText('');
    }
  };

  const handleToggleItem = (itemId: string) => {
    if (moduleWithItems.type !== 'bucketlist') {
      toggleItemComplete(moduleWithItems.id, itemId);
    }
  };

  const handleClearCompleted = () => {
    console.log('Clear button pressed');
    if (moduleWithItems.type !== 'bucketlist') {
      clearCompletedItems(moduleWithItems.id);
    }
    setNewItemText('');
    setTimeframeText('');
  };

  const handleDeleteAll = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAll = () => {
    deleteAllItems(moduleWithItems.id);
    setShowDeleteConfirm(false);
  };

  const cancelDeleteAll = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{moduleWithItems.name}</ThemedText>
      <FlatList
        data={moduleWithItems.items}
        renderItem={({ item }) => (
          <AnimatedListItem item={item} onToggle={handleToggleItem} moduleType={moduleWithItems.type} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item"
          placeholderTextColor="#888"
          value={newItemText}
          onChangeText={setNewItemText}
        />
        {moduleWithItems.type === 'bucketlist' && (
          <TextInput
            style={styles.input}
            placeholder="Timeframe (e.g., 'Next year')"
            placeholderTextColor="#888"
            value={timeframeText}
            onChangeText={setTimeframeText}
          />
        )}
        <Pressable onPress={handleAddItem} style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="white" />
        </Pressable>
      </ThemedView>
      <View style={styles.bottomButtonsContainer}>
        {moduleWithItems.type !== 'bucketlist' && (
          <Pressable onPress={handleClearCompleted} style={styles.clearButton}>
            <ThemedText style={styles.clearButtonText}>Clear Finished Items</ThemedText>
          </Pressable>
        )}
        <Pressable onPress={handleDeleteAll} style={styles.deleteAllButton}>
          <ThemedText style={styles.deleteAllButtonText}>Delete All</ThemedText>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={cancelDeleteAll}
      >
        <ThemedView style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText type="subtitle">Confirm Deletion</ThemedText>
            <ThemedText style={{ color: '#4B0082' }}>Are you sure you want to delete all items?</ThemedText>
            <ThemedView style={styles.modalButtons}>
              <Pressable style={[styles.button, styles.buttonConfirm]} onPress={confirmDeleteAll}>
                <ThemedText style={styles.textStyle}>Yes, Delete</ThemedText>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonCancel]} onPress={cancelDeleteAll}>
                <ThemedText style={styles.textStyle}>Cancel</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  list: {
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#66BB6A',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#66BB6A',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  clearButton: {
    backgroundColor: '#66BB6A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'FredokaRegular',
  },
  deleteAllButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  deleteAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'FredokaRegular',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  buttonConfirm: {
    backgroundColor: '#66BB6A',
  },
  buttonCancel: {
    backgroundColor: '#FF69B4',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
