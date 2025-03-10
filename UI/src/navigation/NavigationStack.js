import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home';
import Login from '../Screens/Login';
import SignUp from '../Screens/SignUp';
import AddTaskScreen from '../Screens/AddTaskScreen';
import TaskDetailScreen from '../Screens/TaskDetailScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View} from 'react-native';
import OtpVerification from '../Screens/OtpVerification';
import ResetPassword from '../Screens/ResetPassword';


const Stack = createNativeStackNavigator();

const NavigationStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setInitialRoute("Home");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setInitialRoute("Login");
      }
    };

    checkAuth();
  }, []);
  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the default header for all screens
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen
        name='Login'
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Signup'
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='AddTask'
        component={AddTaskScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TaskDetail'
        component={TaskDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='OtpVerify'
        component={OtpVerification}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
      name='ResetPassword'
      component={ResetPassword}
      options={{
        headerShown: false,
        animation: 'slide_from_left'
      }}
      />
    </Stack.Navigator>
  );
}

export default NavigationStack;

