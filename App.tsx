import React, { useState, useEffect } from 'react'
import { Platform, View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
///
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
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
import { UnreadMessagesProvider, useUnreadMessages } from './contexts/UnreadMessages ';
import AuthScreen from './screens/authScreen/AuthScreen';
import OnlineUser from './component/conversations/OnlineUser';
///
import { usePushNoti } from './utils/usePushNoti';
///
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ route }: any) {
  const { userData } = route.params
  const { unreadMessages } = useUnreadMessages();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          // borderTopColor: "#f3f4fdb3",
          borderTopWidth: 0

        },
      }}>
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <View style={{ margin: 5 }}>
              <Ionicons
                name={'chatbubble'}
                size={30}
                color={focused ? '#FF9134' : 'gray'}
              />
              {unreadMessages > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -7,
                    backgroundColor: 'red',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: "#fff",
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>
                    {unreadMessages}
                  </Text>
                </View>
              )}
            </View>
          ),
        })}
        initialParams={{
          userData,
          unreadMessages,
        }}
      />
      <Tab.Screen
        name="ContactsScreen"
        component={SearchFriendScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'search'}
              color={focused ? '#FF9134' : 'gray'}
              size={30} />
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
              size={30} />
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
              size={30} />
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
  const { expoPushToken } = usePushNoti()
  console.log(expoPushToken)
  
  return (
    <UnreadMessagesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthScreen" screenOptions={{ headerShown: false, }}>
          <Stack.Screen name="HomeTabs" component={TabNavigator} />

          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="OnlineUser" component={OnlineUser} />


          <Stack.Screen name="MessageScreen" component={MessageScreen} />
          <Stack.Screen name="NewChat" component={NewChat} />

          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
          <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen} />

          <Stack.Screen name="SearchFriendScreen" component={SearchFriendScreen} />
          <Stack.Screen name="FriendScreen" component={FriendScreen} />


        </Stack.Navigator>
      </NavigationContainer>
    </UnreadMessagesProvider>
  );
}

export default App;

