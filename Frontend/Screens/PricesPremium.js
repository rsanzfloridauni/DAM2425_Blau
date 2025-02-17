import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';

import Context from '../services/Context';

const PricesPremium = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { isSpanish } = useLanguage();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const { token, setToken } = useContext(Context);
  const { user, setUser } = useContext(Context);

  const handlePlanSelection = async (plan) => {
    setIsProcessing(true);
    setSelectedPlan(plan);

    const planNumber = plan === '1 Month' ? 1 : plan === '3 Months' ? 2 : 3;

    try {
      console.log("Enviando solicitud al backend...");
      console.log("Datos enviados:", { userId: user.id, plan: planNumber });

      const url = `http://34.232.87.107:8080/API/user/update-premium?userId=${user.id}&plan=${planNumber}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      console.log("Respuesta del backend:", response);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error del backend:", errorData);
        throw new Error(errorData || 'Error al actualizar el plan premium');
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data);

      setUser({
        ...user,
        premium: data.premium,
        premiumExpirationDate: data.premiumExpirationDate,
      });

      setIsProcessing(false);
      setModalVisible(true);
    } catch (error) {
      console.error('Error:', error);
      setIsProcessing(false);
      Alert.alert('Error', error.message || (isSpanish ? 'No se pudo actualizar el plan premium. Inténtalo de nuevo.' : 'Could not update premium plan. Please try again.'));

    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#FFF' },
      ]}>
      {/* Texto que muestra la fecha de expiración del premium */}
      {user.premium && user.premiumExpirationDate && (
        <Text style={[styles.premiumExpirationText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish ? 'Tu premium expira el día:' : 'Your premium expires on:'} {user.premiumExpirationDate}
        </Text>
      )}

      <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>
        {isSpanish ? 'Elige tu plan' : 'Choose Your Plan'}
      </Text>

      <View style={styles.planContainer}>
        <TouchableOpacity
          style={[styles.planButton, { backgroundColor: '#f05c79' }]}
          onPress={() => handlePlanSelection('1 Month')}
          disabled={isProcessing}>
          <Text style={styles.planButtonText}>{isSpanish ? 'Plan de 1 Mes' : '1 Month Plan'}</Text>
          <Text style={styles.planPrice}>4.99€</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planButton, { backgroundColor: '#DC143C' }]}
          onPress={() => handlePlanSelection('3 Months')}
          disabled={isProcessing}>
          <Text style={styles.planButtonText}>{isSpanish ? 'Plan de 3 Meses' : '3 Months Plan'}</Text>
          <Text style={styles.planPrice}>11.99€</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planButton, { backgroundColor: '#8c0d26' }]}
          onPress={() => handlePlanSelection('1 Year')}
          disabled={isProcessing}>
          <Text style={styles.planButtonText}>{isSpanish ? 'Plan de 1 Año' : '1 Year Plan'}</Text>
          <Text style={styles.planPrice}>49.99€</Text>
        </TouchableOpacity>
      </View>

      {isProcessing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC143C" />
          <Text
            style={[
              styles.loadingText,
              { color: isDarkMode ? '#FFF' : '#000' },
            ]}>
            {isSpanish ? 'Procesando pago...' : 'Processing payment...'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        disabled={isProcessing}>
        <Text style={styles.backButtonText}>{isSpanish ? 'Regresar' : 'Go Back'}</Text>
      </TouchableOpacity>

      {/* Custom Modal for Alert */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? '#333' : '#FFF' },
          ]}>
          <Text
            style={[
              styles.modalTitle,
              { color: isDarkMode ? '#FFF' : '#000' },
            ]}>
            {isSpanish ? 'Pago exitoso 🎉' : 'Payment Successful 🎉'}
          </Text>
          <Text style={[styles.modalText, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {isSpanish
              ? `Te has suscrito exitosamente al plan de ${selectedPlan}`
              : `You have successfully subscribed to the ${selectedPlan} plan!`}
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  premiumExpirationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  planContainer: {
    width: '100%',
  },
  planButton: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  planPrice: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#C7C7C7',
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: '#DC143C',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#DC143C',
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PricesPremium;