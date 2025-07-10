import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, TextInput, Pressable, ScrollView, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppState } from '@/state/AppState';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Available icons for selection
const availableIcons = [
  'shopping-cart', 'list', 'star', 'favorite', 'home', 'work', 'school', 'fitness-center',
  'restaurant', 'local-grocery-store', 'kitchen', 'weekend', 'event', 'schedule', 'check-circle',
  'assignment', 'bookmark', 'flag', 'priority-high', 'local-offer', 'card-giftcard', 'cake',
  'celebration', 'sports-soccer', 'music-note', 'movie', 'camera-alt', 'brush', 'code',
  'psychology', 'self-improvement', 'spa', 'healing', 'favorite-border', 'thumb-up',
  'emoji-events', 'military-tech', 'workspace-premium', 'diamond', 'auto-awesome'
];

export default function CreateModuleScreen() {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('shopping-cart');
  const { addModule } = useAppState();
  const router = useRouter();
  const { type } = useLocalSearchParams();

  const handleCreate = () => {
    if (name.trim() && typeof type === 'string') {
      addModule(name.trim(), type as 'groceries' | 'todo' | 'bucketlist', selectedIcon);
      router.back();
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'groceries':
        return 'shopping-cart';
      case 'todo':
        return 'check-circle';
      case 'bucketlist':
        return 'star';
      default:
        return 'list';
    }
  };

  // Set default icon based on type when component mounts
  useEffect(() => {
    setSelectedIcon(getDefaultIcon());
  }, [type]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create a New List</ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="List Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <ThemedText type="subtitle" style={styles.sectionTitle}>Choose an Icon</ThemedText>
      
      <ScrollView style={styles.iconGrid} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          {availableIcons.map((iconName) => (
            <Pressable
              key={iconName}
              style={[
                styles.iconButton,
                selectedIcon === iconName && styles.selectedIconButton
              ]}
              onPress={() => setSelectedIcon(iconName)}
            >
              <MaterialIcons 
                name={iconName as any} 
                size={24} 
                color={selectedIcon === iconName ? 'white' : '#66BB6A'} 
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable onPress={handleCreate} style={styles.createButton}>
        <MaterialIcons name="add" size={24} color="white" style={styles.buttonIcon} />
        <ThemedText style={styles.buttonText}>Create</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#4B0082', // Hardcoded consistent purple background
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  iconGrid: {
    maxHeight: 300,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#66BB6A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedIconButton: {
    backgroundColor: '#66BB6A',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66BB6A',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'FredokaRegular',
  },
});
