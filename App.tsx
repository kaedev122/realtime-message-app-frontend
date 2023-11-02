import React, { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
///
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
///
import RegisterScreen from './screens/authScreen/RegisterScreen'
import LoginScreen from './screens/authScreen/LoginScreen'
///
import ChatScreen from './screens/chatScreen/ChatScreen';
import MessageScreen from './screens/chatScreen/MessageScreen';
import NewChat from './screens/chatScreen/NewChat';
///
import SearchFriendScreen from "./screens/friendScreen/SearchFriendScreen";
import FriendScreen from "./screens/friendScreen/FriendScreen";
///
import UserProfileScreen from './screens/userScreens/UserProfileScreen';
import UpdateUserScreen from './screens/userScreens/UpdateUserScreen';
import Media from './component/Media';

///
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ route, navigation }: any) {
  const { userData } = route.params
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          shadowColor: '#00000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          elevation: 10,

        },
      }}>
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={'chatbubble'}
              size={25}
              color={focused ? '#FF9134' : 'gray'}
            />
          ),
        }}
        initialParams={{
          userData
        }}
      />
      <Tab.Screen
        name="ContactsScreen"
        component={SearchFriendScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'search'}
              color={focused ? '#FF9134' : 'gray'}
              size={24} />
          ),
        }}
        initialParams={{
          userData
        }}
      />
      <Tab.Screen
        name="FriendScreen"
        component={FriendScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'md-people'}
              color={focused ? '#FF9134' : 'gray'}
              size={25} />
          ),
        }}
        initialParams={{
          userData
        }}
      />
      <Tab.Screen
        name="Setting"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome name={'user'}
              color={focused ? '#FF9134' : 'gray'}
              size={24} />
          ),
        }}
        initialParams={{
          userData
        }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="Media" component={Media} />

        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: true }} />
        <Stack.Screen name="NewChat" component={NewChat} />

        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen} />

        <Stack.Screen name="SearchFriendScreen" component={SearchFriendScreen} />
        <Stack.Screen name="FriendScreen" component={FriendScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

