import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import { ModuleCard } from './ModuleCard';
import { useRouter } from 'expo-router';
import { useAppState } from '@/state/AppState';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

export function ModuleListScreen({ title, type }: { title: string; type: 'groceries' | 'todo' | 'bucketlist' }) {
  const router = useRouter();
  const { modules } = useAppState();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset states when type changes
    setShouldAnimate(false);
    setIsVisible(false);
    
    // Delay before showing content and starting animation
    const timer = setTimeout(() => {
      setIsVisible(true);
      setShouldAnimate(true);
    }, 300); // Increased delay for smoother transition
    
    return () => clearTimeout(timer);
  }, [type]);

  const filteredModules = modules.filter(module => module.type === type);

  const getButtonIcon = () => {
    switch (type) {
      case 'todo':
        return 'gavel'; // Gavel icon for lawyer/work
      case 'bucketlist':
        return 'luggage'; // Luggage icon for travel/bucket list
      case 'groceries':
        return 'restaurant'; // Restaurant icon for food
      default:
        return 'add';
    }
  };

  // Don't render anything until we're ready to animate
  if (!isVisible) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      <FlatList
        data={filteredModules}
        renderItem={({ item, index }) => <ModuleCard module={item} index={index} shouldAnimate={shouldAnimate} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <Pressable
        onPress={() => router.push({ pathname: '/create-module', params: { type } })}
        style={styles.createButton}
      >
        <MaterialIcons name={getButtonIcon()} size={24} color="white" style={styles.buttonIcon} />
        <ThemedText style={styles.buttonText}>Create New List</ThemedText>
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
    marginBottom: 16,
  },
  list: {
    flexGrow: 1,
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