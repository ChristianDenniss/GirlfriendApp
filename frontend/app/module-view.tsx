import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, FlatList, TextInput, Pressable, Modal, View, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppState } from '@/state/AppState';
import { useState, useEffect } from 'react';
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleToggleItem = async (itemId: string) => {
    await toggleItemComplete(moduleWithItems.id, itemId);
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

  // Common grocery items for auto-complete
  const grocerySuggestions = [
    'Milk', 'Bread', 'Eggs', 'Bananas', 'Apples', 'Chicken', 'Rice', 'Pasta',
    'Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Lettuce', 'Cheese', 'Yogurt',
    'Butter', 'Olive Oil', 'Salt', 'Pepper', 'Garlic', 'Ginger', 'Lemons',
    'Oranges', 'Strawberries', 'Blueberries', 'Spinach', 'Kale', 'Broccoli',
    'Cauliflower', 'Bell Peppers', 'Cucumber', 'Avocado', 'Sweet Potatoes', "Sour Dough Bread", "Sourdough Bread",
    'Salmon', 'Ground Beef', 'Pork Chops', 'Turkey', 'Ham', 'Bacon',
    'Cereal', 'Oatmeal', 'Granola', 'Nuts', 'Almonds','almond butter', 'Walnuts',
    'Peanut Butter', 'Jelly', 'Honey', 'Maple Syrup', 'Flour', 'Sugar',
    'Baking Soda', 'Baking Powder', 'Vanilla Extract', 'Chocolate Chips',
    'Chips', 'Popcorn', 'Crackers', 'Cookies', 'Ice Cream', 'Frozen Pizza',
    'Frozen Vegetables', 'Frozen Fruit', 'Juice', 'Soda', 'Water', 'Coffee',
    'Tea', 'Wine', 'Beer', 'Dish Soap', 'Laundry Detergent', 'Toilet Paper',
    'Paper Towels', 'Trash Bags', 'Shampoo', 'Soap', 'Toothpaste', 'Deodorant',
    
    // Vegan-specific items
    'Tofu', 'Tempeh', 'Seitan', 'Nutritional Yeast', 'Chickpeas', 'Lentils', 'Quinoa',
    'Chia Seeds', 'Flax Seeds', 'Hemp Seeds', 'Edamame', 'Miso Paste', 'Tamari',
    'Kombucha', 'Sauerkraut', 'Kimchi', 'Agar Agar', 'Aquafaba', 'Jackfruit',
    'Spirulina', 'Chlorella', 'Maca Powder', 'Matcha', 'Coconut Aminos', 'Liquid Smoke',
    'Vital Wheat Gluten', 'Textured Vegetable Protein', 'TVP', 'Soy Curls',
    'Dulse', 'Nori', 'Wakame', 'Kelp', 'Carrageenan', 'Xanthan Gum',
    'Psyllium Husk', 'Arrowroot Powder', 'Tapioca Starch', 'Hummus',
    
    // Additional Vegetables
    'Zucchini', 'Eggplant', 'Mushrooms', 'Asparagus', 'Brussels Sprouts', 'Cabbage',
    'Bok Choy', 'Collard Greens', 'Swiss Chard', 'Arugula', 'Watercress', 'Radishes',
    'Turnips', 'Parsnips', 'Beets', 'Celery', 'Fennel', 'Artichokes', 'Okra',
    'Green Beans', 'Peas', 'Corn', 'Squash', 'Pumpkin', 'Butternut Squash',
    'Acorn Squash', 'Rutabaga', 'Jicama', 'Kohlrabi', 'Daikon', 'Bamboo Shoots',
    'Bean Sprouts', 'Alfalfa Sprouts', 'Microgreens', 'Baby Carrots', 'Baby Corn',
    'Cherry Tomatoes', 'Roma Tomatoes', 'Heirloom Tomatoes', 'Tomatillos',
    'Jalapeño Peppers', 'Bell Peppers', 'Poblano Peppers', 'Red Onions',
    'Yellow Onions', 'White Onions', 'Shallots', 'Scallions', 'Leeks',
    'Russet Potatoes', 'Red Potatoes', 'Yukon Gold Potatoes', 'Sweet Potatoes',
    'Purple Sweet Potatoes', 'Japanese Sweet Potatoes', 'Carrots', 'Baby Carrots',
    'Rainbow Carrots', 'Kale', 'Curly Kale', 'Lacinato Kale', 'Spinach',
    'Baby Spinach', 'Savoy Spinach', 'Broccoli', 'Broccolini', 'Cauliflower',
    'Purple Cauliflower', 'Lettuce', 'Romaine Lettuce', 'Iceberg Lettuce',
    'Cucumber', 'English Cucumber', 'Persian Cucumber', 'Avocado', 'Hass Avocado',
    'Fuerte Avocado'
  ];

  // Auto-complete logic for groceries
  useEffect(() => {
    if (moduleWithItems.type === 'groceries' && newItemText.trim().length > 0) {
      const filtered = grocerySuggestions.filter(item =>
        item.toLowerCase().includes(newItemText.toLowerCase()) &&
        !moduleWithItems.items.some(existingItem => 
          existingItem.text.toLowerCase() === item.toLowerCase()
        )
      );
      setSuggestions(filtered.slice(0, 5)); // Show top 5 suggestions
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [newItemText, moduleWithItems.type, moduleWithItems.items]);

  // Don't hide suggestions when keyboard is dismissed - keep them visible

  const handleSuggestionPress = (suggestion: string) => {
    setNewItemText(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <ThemedView style={styles.container}>
      <Pressable 
        style={{ flex: 1 }}
        onPress={() => {
          // Allow swipe down to dismiss keyboard
          Keyboard.dismiss();
          setShowSuggestions(false);
          setSuggestions([]);
        }}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 120}
        >
        <ThemedText type="title" style={styles.title}>{moduleWithItems.name}</ThemedText>
        <FlatList
          data={moduleWithItems.items}
          renderItem={({ item }) => (
            <AnimatedListItem item={{ ...item, text: item.text }} onToggle={handleToggleItem} moduleType={moduleWithItems.type} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
        
        {/* Auto-complete suggestions for groceries */}
        {showSuggestions && moduleWithItems.type === 'groceries' && (
          <Pressable 
            style={styles.suggestionsContainer} 
            onPress={(e) => {
              e.stopPropagation(); // Prevent event from bubbling to parent
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  style={styles.suggestionChip}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling to parent
                    handleSuggestionPress(suggestion);
                  }}
                >
                  <ThemedText style={styles.suggestionText}>{suggestion}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        )}
        
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add new item"
            placeholderTextColor="#888"
            value={newItemText}
            onChangeText={setNewItemText}
            blurOnSubmit={false}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              setShowSuggestions(false);
              setSuggestions([]);
            }}
            onBlur={() => {
              // Don't hide suggestions when input loses focus
            }}
            onFocus={() => {
              // Don't need to re-show suggestions since they stay visible
            }}
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
      </KeyboardAvoidingView>
      </Pressable>

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
  suggestionsContainer: {
    marginTop: 4,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  suggestionChip: {
    backgroundColor: '#66BB6A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#4B0082',
    alignSelf: 'flex-start',
  },
  suggestionText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'FredokaRegular',
  },
});
