import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ModuleCard } from './ModuleCard';
import { useRouter } from 'expo-router';
import { useAppState } from '@/state/AppState';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

export function ModuleListScreen({ title, type }: { title: string; type: 'groceries' | 'todo' | 'bucketlist' }) {
  const router = useRouter();
  const { modules, loading, error, refreshModules } = useAppState();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(false);
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [type]);

  const filteredModules = modules.filter(module => module.type === type);

  const getButtonIcon = () => {
    switch (type) {
      case 'todo':
        return 'gavel';
      case 'bucketlist':
        return 'luggage';
      case 'groceries':
        return 'restaurant';
      default:
        return 'add';
    }
  };

  const handleCreateModule = async () => {
    try {
      await router.push({ pathname: '/create-module', params: { type } });
    } catch (err) {
      Alert.alert('Error', 'Failed to navigate to create module screen');
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshModules();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh modules');
    }
  };

  // Show loading state
  if (loading && modules.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#66BB6A" />
          <ThemedText style={styles.loadingText}>Loading modules...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // Show error state
  if (error && modules.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
        <ThemedView style={styles.errorContainer}>
          <MaterialIcons name="error" size={48} color="#FF69B4" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Pressable style={styles.retryButton} onPress={handleRefresh}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  // Don't render anything until we're ready to animate
  if (!shouldAnimate) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      
      {error && (
        <ThemedView style={styles.errorBanner}>
          <ThemedText style={styles.errorBannerText}>{error}</ThemedText>
        </ThemedView>
      )}
      
      <FlatList
        data={filteredModules}
        renderItem={({ item, index }) => <ModuleCard module={item} index={index} shouldAnimate={shouldAnimate} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={48} color="#66BB6A" />
            <ThemedText style={styles.emptyText}>No {type} lists yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>Create your first list to get started!</ThemedText>
          </ThemedView>
        }
      />
      
      <Pressable
        onPress={handleCreateModule}
        style={styles.createButton}
        disabled={loading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'white',
    fontFamily: 'FredokaRegular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#66BB6A',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'FredokaRegular',
  },
  retryButton: {
    backgroundColor: '#66BB6A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4B0082',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#66BB6A',
  },
  errorBannerText: {
    color: '#66BB6A',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    fontFamily: 'FredokaRegular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#FF69B4',
    marginTop: 16,
    textTransform: 'capitalize',
    fontFamily: 'FredokaRegular',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#66BB6A',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'FredokaRegular',
  },
});