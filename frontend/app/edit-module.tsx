import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppState } from '@/state/AppState';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditModuleScreen() {
  const { id } = useLocalSearchParams();
  const { modules, editModule } = useAppState();
  const router = useRouter();
  const module = modules.find(m => m.id === id);
  const [name, setName] = useState(module?.name || '');
  const [creationDate, setCreationDate] = useState(module?.createdAt || '');

  useEffect(() => {
    if (module) {
      setName(module.name);
      setCreationDate(module.createdAt);
    }
  }, [module]);

  const handleSave = () => {
    if (module && name.trim()) {
      editModule(module.id, name.trim(), String(creationDate));
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
