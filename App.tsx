import React, { useState, useEffect } from 'react'
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
///
import SearchFriendScreen from './screens/friendScreen/SearchFriendScreen';
import FriendScreen from "./screens/friendScreen/FriendScreen";
///
import UserProfileScreen from './screens/userScreens/UserProfileScreen';
import UpdateUserScreen from './screens/userScreens/UpdateUserScreen';

///
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation, route }: any) => {
  const { userData } = route.params
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fafafa',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
        },
      }}>
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
              size={25}
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
              <Ionicons name={focused ? 'search' : 'search-outline'} size={24}  />
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
                    <Ionicons name={focused ? 'md-people' : 'md-people-outline'} size={25} />
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
            <FontAwesome name={focused ? 'user' : 'user-o'} size={24} />
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
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={TabNavigator} />

        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        <Stack.Screen name="MessageScreen" component={MessageScreen} />

        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen} />

        <Stack.Screen name="SearchFriendScreen" component={SearchFriendScreen} />
          <Stack.Screen name="FriendScreen" component={FriendScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

