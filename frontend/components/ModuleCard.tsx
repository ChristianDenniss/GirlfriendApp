import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, Pressable, Platform, Modal } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppState } from '@/state/AppState';
import { ThemedView } from '@/components/ThemedView';

// Reusable confirmation modal
export function ConfirmModal({ visible, title, message, confirmText, cancelText, onConfirm, onCancel }: {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <ThemedView style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <ThemedText type="subtitle" style={{ color: '#4B0082' }}>{title}</ThemedText>
          <ThemedText style={{ color: '#4B0082' }}>{message}</ThemedText>
          <ThemedView style={styles.modalButtons}>
            <Pressable style={[styles.button, styles.buttonConfirm]} onPress={onConfirm}>
              <ThemedText style={styles.textStyle}>{confirmText}</ThemedText>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonCancel]} onPress={onCancel}>
              <ThemedText style={styles.textStyle}>{cancelText}</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

export function ModuleCard({ module, index, shouldAnimate }: { module: { id: string; name: string; icon?: string; createdAt: string }, index: number, shouldAnimate: boolean }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const router = useRouter();
  const { deleteModule } = useAppState();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      // Start animation with delay based on index
      opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
      translateY.value = withDelay(index * 100, withTiming(0, { duration: 500 }));
    } else {
      // Keep invisible until animation should start
      opacity.value = 0;
      translateY.value = 20;
    }
  }, [shouldAnimate, index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteModule(module.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    router.push({ pathname: '/edit-module', params: { id: module.id } });
  };

  return (
    <Pressable onPress={() => router.push({ pathname: '/module-view', params: { id: module.id } })}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <ThemedView style={styles.innerCardContent}>
          <ThemedView style={styles.iconContainer}>
            <MaterialIcons 
              name={module.icon as any || 'list'} 
              size={24} 
              color="#66BB6A" 
            />
          </ThemedView>
          <ThemedView style={styles.textContainer}>
            <ThemedText type="subtitle" style={[styles.titleCenter, { color: 'white' }]}>{module.name}</ThemedText>
            <ThemedText type="default" style={[styles.date, styles.titleCenter]}>Created: {new Date(module.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.actionsContainer}>
            <Pressable onPress={handleEdit} style={styles.actionButton}>
              <MaterialIcons name="edit" size={24} color="#66BB6A" />
            </Pressable>
            <Pressable onPress={handleDelete} style={styles.actionButton}>
              <MaterialIcons name="delete" size={24} color="#66BB6A" />
            </Pressable>
          </ThemedView>
        </ThemedView>
      </Animated.View>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this list?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#66BB6A',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
    
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  titleCenter: {
    textAlign: 'center',
    width: '100%',
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  innerCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  // Modal styles (copied from module-view.tsx and adapted)
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

