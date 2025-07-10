import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, TextInput, Pressable, ScrollView, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppState } from '@/state/AppState';
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

export default function EditModuleScreen() {
  const { id } = useLocalSearchParams();
  const { modules, editModule } = useAppState();
  const router = useRouter();
  const module = modules.find(m => m.id === id);
  const [name, setName] = useState(module?.name || '');
  const [creationDate, setCreationDate] = useState(module?.createdAt || '');
  const [selectedIcon, setSelectedIcon] = useState(module?.icon || 'list');

  useEffect(() => {
    if (module) {
      setName(module.name);
      setCreationDate(module.createdAt);
      setSelectedIcon(module.icon || 'list');
    }
  }, [module]);

  const handleSave = () => {
    if (module && name.trim()) {
      editModule(module.id, name.trim(), String(creationDate), selectedIcon);
      router.back();
    }
  };

  if (!module) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Module Not Found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Edit List</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Edit List Name</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="List Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <ThemedText type="subtitle" style={styles.subtitle}>Edit Creation Date</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#888"
        value={String(creationDate)}
        onChangeText={setCreationDate}
      />
      <ThemedText type="subtitle" style={styles.subtitle}>Edit Icon</ThemedText>
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
      <Pressable onPress={handleSave} style={styles.saveButton}>
        <MaterialIcons name="save" size={24} color="white" style={styles.buttonIcon} />
        <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
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
  title: {
    marginBottom: 20,
  },
  subtitle: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
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
  saveButton: {
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
