import { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from '../components/Icon';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext'; 
import Context from '../services/Context';
import CryptoJS from 'crypto-js'; 

export default function ResetPasswordPage({ navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isSpanish } = useLanguage(); 
  const { gmailResetContrasena } = useContext(Context);

  useEffect(() => {
    return () => {
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    };
  }, []);

  const validatePasswords = () => {
    let newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = isSpanish ? 'La nueva contraseña es obligatoria' : 'New Password is required';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = isSpanish ? 'Debe confirmar la nueva contraseña' : 'Confirm Password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = isSpanish ? 'Las contraseñas no coinciden' : 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (validatePasswords()) {
      try {

        const hashedPassword = CryptoJS.SHA256(newPassword).toString();

        const response = await fetch('http://34.232.87.107:8080/API/reset-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: gmailResetContrasena, 
            newPassword: hashedPassword, 
          }),
        });

        if (response.ok) {
          Alert.alert(
            isSpanish ? 'Contraseña restablecida exitosamente' : 'Password Reset Successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  setNewPassword('');
                  setConfirmPassword('');
                  setErrors({});
                  navigation.navigate('Login');
                },
              },
            ]
          );
        } else {
          Alert.alert(isSpanish ? 'Error' : 'Error', isSpanish ? 'No se pudo restablecer la contraseña' : 'Failed to reset password');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert(
          isSpanish ? 'Error' : 'Error',
          isSpanish ? 'Ocurrió un error al restablecer la contraseña' : 'An error occurred while resetting the password'
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' }]}>
        <Icon />

        <View style={styles.toggleContainer}>
          <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={24} color={isDarkMode ? '#FFF' : '#000'} />
          <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />
        </View>

        <TextInput
          style={[styles.input, errors.newPassword && styles.inputError]}
          placeholder={isSpanish ? 'Nueva contraseña' : 'New Password'}
          placeholderTextColor="#666"
          secureTextEntry
          autoCapitalize="none"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder={isSpanish ? 'Confirmar nueva contraseña' : 'Confirm New Password'}
          placeholderTextColor="#666"
          secureTextEntry
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity style={styles.sendLinkButton} onPress={handleResetPassword}>
          <Text style={styles.sendLinkButtonText}>{isSpanish ? 'Restablecer contraseña' : 'Reset Password'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
  },
  toggleContainer: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#c51d34',
    borderWidth: 3,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#C7C7C7',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  sendLinkButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  sendLinkButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});