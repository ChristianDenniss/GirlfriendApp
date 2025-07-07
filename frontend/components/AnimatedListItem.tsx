
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

interface AnimatedListItemProps {
  item: { id: string; text: string; completed?: boolean; timeframe?: string };
  onToggle?: (itemId: string) => void;
  moduleType: 'groceries' | 'todo' | 'bucketlist';
}

export function AnimatedListItem({ item, onToggle, moduleType }: AnimatedListItemProps) {
  const checkmarkScale = useSharedValue(item.completed ? 1 : 0);

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
    };
  });

  const handleToggle = () => {
    if (onToggle && moduleType !== 'bucketlist') {
      onToggle(item.id);
      checkmarkScale.value = withTiming(item.completed ? 0 : 1, { duration: 200 });
    }
  };

  return (
    <Pressable onPress={handleToggle}>
      <ThemedView style={styles.itemContainer}>
        {moduleType !== 'bucketlist' && (
          <Animated.View style={[styles.checkbox, animatedCheckmarkStyle]}>
            {item.completed && <MaterialIcons name="check" size={20} color="white" />}
          </Animated.View>
        )}
        <ThemedText style={[styles.itemText, item.completed && styles.completedText]}>
          {item.text}
        </ThemedText>
        {moduleType === 'bucketlist' && item.timeframe && (
          <ThemedText style={styles.timeframeText}>{item.timeframe}</ThemedText>
        )}
      </ThemedView>
    </Pressable>
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
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  timeframeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});
