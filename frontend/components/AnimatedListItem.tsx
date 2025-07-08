import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Pressable, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useEffect, useRef } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

interface AnimatedListItemProps {
  item: { id: string; text: string; completed?: boolean; timeframe?: string };
  onToggle?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  moduleType: 'groceries' | 'todo' | 'bucketlist';
}

export function AnimatedListItem({ item, onToggle, onDelete, moduleType }: AnimatedListItemProps) {
  const checkmarkScale = useSharedValue(item.completed ? 1 : 0);
  const swipeableRef = useRef<Swipeable>(null);

  // Always sync animation state with prop state
  useEffect(() => {
    console.log('Item prop changed:', item.id, 'completed:', item.completed);
    checkmarkScale.value = withTiming(item.completed ? 1 : 0, { duration: 200 });
  }, [item.completed]);

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
    };
  });

  const handleToggle = async () => {
    if (onToggle) {
      console.log('Toggling item:', item.id, 'Current completed:', item.completed);
      await onToggle(item.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  const renderRightActions = () => {
    return (
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <MaterialIcons name="delete" size={24} color="white" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={80}
      onSwipeableOpen={handleDelete}
      overshootRight={false}
    >
      <Pressable onPress={handleToggle}>
        <ThemedView style={styles.itemContainer}>
          <Animated.View style={[styles.checkbox, animatedCheckmarkStyle]}>
            {item.completed && <MaterialIcons name="check" size={20} color="white" />}
          </Animated.View>
          <ThemedText style={[styles.itemText, item.completed && styles.completedText]}>
            {item.text}
          </ThemedText>
          {moduleType === 'bucketlist' && item.timeframe && (
            <ThemedText style={styles.timeframeText}>{item.timeframe}</ThemedText>
          )}
        </ThemedView>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#4B0082',
    minHeight: 60,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FF69B4',
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#ccc',
  },
  timeframeText: {
    fontSize: 14,
    color: '#ddd',
    marginLeft: 10,
    fontFamily: 'FredokaRegular',
  },
  deleteButton: {
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'FredokaRegular',
    fontWeight: '600',
  },
});
