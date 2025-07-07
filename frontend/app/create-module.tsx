
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useAppState } from '@/state/AppState';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function CreateModuleScreen() {
  const [name, setName] = useState('');
  const { addModule } = useAppState();
  const router = useRouter();
  const { type } = useLocalSearchParams();

  const handleCreate = () => {
    if (name.trim() && typeof type === 'string') {
      addModule(name.trim(), type as 'groceries' | 'todo' | 'bucketlist');
      router.back();
    }
  };

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
