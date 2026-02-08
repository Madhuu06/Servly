import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

// Import screens (we'll create these next)
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ProviderDashboardScreen from '../screens/ProviderDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator for authenticated users
function MainTabs() {
    const { isProvider } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2D2D2D',
                tabBarInactiveTintColor: '#9CA3AF',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={isProvider ? ProviderDashboardScreen : UserProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    tabBarLabel: isProvider ? 'Dashboard' : 'Profile',
                }}
            />
        </Tab.Navigator>
    );
}

// Main app navigator
export default function AppNavigator() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    // Auth stack
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                ) : (
                    // Main app stack
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
