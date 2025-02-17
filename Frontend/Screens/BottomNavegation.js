import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Swipe from './Swipe';
import Chat from './ChatList';
import Profile from './ProfileScreen';
import Teacher from './TeacherList';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext'; 

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { isDarkMode } = useTheme();
  const { isSpanish } = useLanguage(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Swipe' || route.name === 'Explorar') {
            iconName = 'heart-outline';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Chat') {
            iconName = 'chatbubble-outline';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile' || route.name === 'Perfil') {
            iconName = 'person-outline';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Teacher' || route.name === 'Profesores') {
            return (
              <FontAwesome name="graduation-cap" size={size} color={color} />
            );
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6',
          borderTopWidth: 0,
          elevation: 5,
          shadowOpacity: 0.2,
        },
        tabBarActiveTintColor: isDarkMode ? '#FF6B6B' : '#DC143C',
        tabBarInactiveTintColor: '#C7C7C7',
        headerShown: false,
      })}
    >
      <Tab.Screen name={isSpanish ? 'Explorar' : 'Swipe'} component={Swipe} />
      <Tab.Screen name={isSpanish ? 'Profesores' : 'Teacher'} component={Teacher} />
      <Tab.Screen name={isSpanish ? 'Chat' : 'Chat'} component={Chat} />
      <Tab.Screen name={isSpanish ? 'Perfil' : 'Profile'} component={Profile} />
    </Tab.Navigator>
  );
}
