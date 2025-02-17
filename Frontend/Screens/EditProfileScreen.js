import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
import Context from '../services/Context';

const EditProfileScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
    const { isSpanish } = useLanguage(); 

  const { token, setToken, user, setUser } = useContext(Context);


  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState(user.age ? String(user.age) : '');
  const [email, setEmail] = useState(user.email || '');
  const [image, setImage] = useState(user.image || '');
  const [programming_languages, setProgramming_languages] = useState(
    user.programming_languages || ''
  );
  const [gender, setGender] = useState(user.gender || '');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false); 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const toggleLanguage = (language) => {
    setProgramming_languages((prevLanguages) => {
      let langArray = prevLanguages ? prevLanguages.split(',') : [];

      if (langArray.includes(language)) {
        langArray = langArray.filter((lang) => lang !== language);
      } else {
        if (langArray.length < 5) {
          langArray.push(language);
        } else {
          alert('You can only select up to 5 languages.');
          return prevLanguages; 
        }
      }

      const updatedLanguages = langArray.join(',');
      setErrors((prev) => ({ ...prev, programming_languages: '' })); 
      return updatedLanguages;
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateUserProfile = async (updatedProfile) => {
    try {
      if (!user?.id) {
        throw new Error('User ID is missing');
      }

      const response = await fetch('http://34.232.87.107:8080/API/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      const data = await response.json();
      console.log(data.name);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const saveProfile = async () => {
    setIsSaving(true); 

    let newErrors = {};

      if (!name.trim()) newErrors.name = isSpanish ? 'El nombre es obligatorio' : 'Name is required';
    if (!email.trim()) newErrors.email = isSpanish ? 'El correo es obligatorio' : 'Email is required';
    if (!age.trim()) newErrors.age = isSpanish ? 'La edad es obligatoria' : 'Age is required';
    if (!gender) newErrors.gender = isSpanish ? 'Selecciona un género' : 'Please select a gender';
    if (!validateEmail(email)) newErrors.email = isSpanish ? 'Formato de correo inválido' : 'Invalid email format';
    if (!programming_languages || programming_languages.trim().length === 0) {
      newErrors.programming_languages = isSpanish
        ? 'Selecciona al menos un lenguaje'
        : 'Please select at least one language';
    }

     const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      newErrors.age = isSpanish ? 'La edad debe ser un número positivo' : 'Age must be a positive number';
    } else if (ageNumber < 18) {
      newErrors.age = isSpanish ? 'La edad mínima es 18' : 'The minimum age is 18';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false); 
      return;
    }

    let imageBase64 = user.image; 
    if (image && image !== user.image) {
      imageBase64 = await convertImageToBase64(image);
    }

    const updatedProfile = {
      id: user.id, 
      name: name,
      age: age ? Number(age) : null,
      email: email,
      image: imageBase64,
      gender: gender,
      programming_languages: programming_languages,
    };

    try {
      const updatedUser = await updateUserProfile(updatedProfile);

      setUser(updatedUser);

      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      alert(`Error al guardar el perfil: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}
    >
      <Image
        source={image ? { uri: image } : require('../imgs/imgb64.jpg')}
        style={styles.image}
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
         <Text style={styles.imagePickerText}>
          {isSpanish ? 'Subir Imagen' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        style={styles.input}
           placeholder={isSpanish ? 'Nombre' : 'Name'}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setErrors((prev) => ({ ...prev, name: '' }));
        }}
      />

      {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
      <TextInput
        style={styles.input}
        placeholder={isSpanish ? 'Edad' : 'Age'}
        keyboardType="phone-pad"
        value={age}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, '');
          setAge(numericText);
          setErrors((prev) => ({ ...prev, age: '' }));
        }}
      />

      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: '' }));
        }}
      />

      <Text style={[styles.genderText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish ? 'Selecciona Género' : 'Select Gender'}
      </Text>
      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      <View style={styles.radioContainer}>
        {['Male', 'Female', 'Prefer Not to Say'].map((genderOption) => (
          <TouchableOpacity
            key={genderOption}
            style={styles.radioButton}
            onPress={() => {
              setGender(genderOption);
              setErrors((prev) => ({ ...prev, gender: '' }));
            }}
          >
            <View style={styles.radioOuter}>
              {gender === genderOption && <View style={styles.radioInner} />}
            </View>
             <Text style={[styles.radioLabel, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {isSpanish
              ? genderOption === 'Male'
                ? 'Hombre'
                : genderOption === 'Female'
                ? 'Mujer'
                : 'Prefiero no decirlo'
              : genderOption}
          </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.genderText, { color: isDarkMode ? '#FFF' : '#000' }]}>
       {isSpanish ? 'Selecciona Lenguajes de Programacion (hasta 5): ' : '  Select Programming Languages (up to 5):'}
      </Text>
      {errors.programming_languages && (
        <Text style={styles.errorText}>{errors.programming_languages}</Text>
      )}
      <ScrollView style={styles.languagesContainer} nestedScrollEnabled={true}>
        {[
          'JavaScript',
          'Python',
          'Java',
          'C#',
          'C++',
          'PHP',
          'TypeScript',
          'Ruby',
          'Swift',
          'Go',
          'Kotlin',
          'Rust',
          'Dart',
          'R',
          'Scala',
        ].map((language) => (
          <TouchableOpacity
            key={language}
            style={[
              styles.languageButton,
              programming_languages.split(',').includes(language) &&
                styles.selectedLanguageButton,
            ]}
            onPress={() => {
              toggleLanguage(language);
              setErrors((prev) => ({ ...prev, programming_languages: '' }));
            }}
          >
            <Text style={[styles.languageText, { color: isDarkMode ? '#FFF' : '#000' }]}>
              {language}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveProfile}
        disabled={isSaving}
      >
        {isSaving ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#FFF" />
            <Text style={[styles.saveButtonText, { marginLeft: 10 }]}>
              {isSpanish ? 'Guardando Cambios...' : 'Saving Changes...'}
            </Text>
          </View>
        ) : (
                   <Text style={styles.saveButtonText}>{isSpanish ? 'Guardar Perfil' : 'Save Profile'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#c51d34',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#C7C7C7',
    fontSize: 14,
  },
  imagePicker: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '90%',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC143C',
  },
  radioLabel: {
    fontSize: 16,
  },
  genderText: {
    fontSize: 16,
    marginBottom: 10,
  },
  languagesContainer: {
    width: '90%',
    maxHeight: 160,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DC143C',
    borderRadius: 5,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DC143C',
    alignItems: 'center',
  },
  selectedLanguageButton: {
    backgroundColor: '#DC143C',
  },
  languageText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
});

export default EditProfileScreen;