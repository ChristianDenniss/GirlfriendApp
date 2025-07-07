import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  const pathname = usePathname();
  const isHome = pathname.endsWith('/home');

  const tabs = (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#66BB6A',
        tabBarInactiveTintColor: '#C0C0C0',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIconStyle: {
          marginBottom: -3,
        },
        tabBarLabelStyle: {
          marginTop: -3,
        },
        // Enable lazy loading for better performance
        lazy: true,
        // Add transition animations
        tabBarHideOnKeyboard: Platform.OS === 'android',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
          lazy: true,
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: 'Groceries',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="local-grocery-store" size={size} color={color} />,
          lazy: true,
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: 'To-Do',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="check-box" size={size} color={color} />,
          lazy: true,
        }}
      />
      <Tabs.Screen
        name="bucketlist"
        options={{
          title: 'Bucket List',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="beach-access" size={size} color={color} />,
          lazy: true,
        }}
      />
    </Tabs>
  );

  return isHome
    ? tabs
    : <SafeAreaView style={{ flex: 1, backgroundColor: '#4B0082' }} edges={['top']}>{tabs}</SafeAreaView>;
}