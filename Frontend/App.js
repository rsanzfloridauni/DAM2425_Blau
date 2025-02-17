import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './components/ThemeContext'; 
import LoginPage from './Screens/LoginPage';
import SignInPage from './Screens/SignInPage';
import ForgotPasswordPage from './Screens/ForgotPassword';
import LoadingScreen from './Screens/LoadingScreen';
import LoadingInicial from './Screens/LoadingInicial';
import BottomTabNavigator from './Screens/BottomNavegation';
import EditProfileScreen from './Screens/EditProfileScreen'
import { Provider } from './services/Context'
import ResetPasswordPage from './Screens/ResetPasswordPage'
import ChatScreen from './Screens/ChatScreen'
import TermsAndConditions from './Screens/TermsAndConditionsScreen'
import PricesPremium from './Screens/PricesPremium'
import ChangePassword from './Screens/ChangePasswordPage'
const Stack = createStackNavigator();
import { LanguageProvider } from './components/LanguageContext';
import Information from './Screens/Information'; 

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <Provider>
      <ThemeProvider> 
        <LanguageProvider>
            <StatusBar hidden={true} />
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="LoadingInicial" component={LoadingInicial} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
                <Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} options={{ headerShown: false }} />
                <Stack.Screen name="ResetPasswordPage" component={ResetPasswordPage} options={{ headerShown: false }} />
                <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
                <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{ headerShown: false }} />
                <Stack.Screen name="PricesPremium" component={PricesPremium} options={{ headerShown: false }} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
                <Stack.Screen name="Information" component={Information} options={{ headerShown: false }} />
              </Stack.Navigator>
            </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}