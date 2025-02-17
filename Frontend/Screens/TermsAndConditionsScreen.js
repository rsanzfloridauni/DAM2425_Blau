import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
const TermsAndConditionsScreen = () => {
  const { isDarkMode } = useTheme();
 const { isSpanish, setIsSpanish } = useLanguage();
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}
    >
      {/* Circular Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../imgs/logoCompleto.jpg')} 
          style={styles.logo}
          resizeMode="cover"
        />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#DC143C' : '#333' }]}>
          {isSpanish ? 'Términos y Condiciones de Love 4 Code' : 'Terms and Conditions of Love 4 Code'}
        </Text>

        {/* Términos y Condiciones Sections */}
        {[
          {
            title: isSpanish ? '1. Introducción' : '1. Introduction',
            content: isSpanish
              ? 'Bienvenido a Love 4 Code. Al acceder y utilizar nuestra plataforma, aceptas los siguientes términos y condiciones. Si no estás de acuerdo, te pedimos que no utilices nuestros servicios.'
              : 'Welcome to Love 4 Code. By accessing and using our platform, you agree to the following terms and conditions. If you do not agree, please do not use our services.',
          },
          {
            title: isSpanish ? '2. Objeto' : '2. Purpose',
            content: isSpanish
              ? 'Love 4 Code es una aplicación diseñada para conectar programadores con oportunidades laborales, colaboraciones y relaciones personales.'
              : 'Love 4 Code is an application designed to connect programmers with job opportunities, collaborations, and personal relationships.',
          },
          {
            title: isSpanish ? '3. Registro y Uso de la Plataforma' : '3. Registration and Platform Use',
            content: isSpanish
              ? 'Para utilizar nuestros servicios, debes registrarte proporcionando información verídica y mantener tu perfil actualizado. Nos reservamos el derecho de suspender o eliminar cuentas que incumplan nuestras normas.'
              : 'To use our services, you must register by providing truthful information and keep your profile updated. We reserve the right to suspend or delete accounts that violate our rules.',
          },
          {
            title: isSpanish ? '4. Conducta del Usuario' : '4. User Conduct',
            content: isSpanish
              ? 'Los usuarios deben: \n- Usar la plataforma de manera respetuosa y profesional.\n- No publicar contenido ofensivo, difamatorio o ilegal.'
              : 'Users must: \n- Use the platform respectfully and professionally.\n- Not post offensive, defamatory, or illegal content.',
          },
          {
            title: isSpanish ? '5. Propiedad Intelectual' : '5. Intellectual Property',
            content: isSpanish
              ? 'Todo el contenido de Love 4 Code está protegido por derechos de propiedad intelectual y no puede ser utilizado sin autorización previa.'
              : 'All content on Love 4 Code is protected by intellectual property rights and cannot be used without prior authorization.',
          },
          {
            title: isSpanish ? '6. Limitación de Responsabilidad' : '6. Limitation of Liability',
            content: isSpanish
              ? 'Love 4 Code no se hace responsable por contenido generado por los usuarios o por daños derivados del uso de la plataforma.'
              : 'Love 4 Code is not responsible for user-generated content or damages resulting from the use of the platform.',
          },
          {
            title: isSpanish ? '7. Modificaciones de los Términos' : '7. Modifications of Terms',
            content: isSpanish
              ? 'Nos reservamos el derecho de actualizar estos términos en cualquier momento. Los usuarios serán notificados de cambios relevantes.'
              : 'We reserve the right to update these terms at any time. Users will be notified of relevant changes.',
          },
          {
            title: isSpanish ? '8. Legislación Aplicable' : '8. Applicable Law',
            content: isSpanish
              ? 'Estos términos se rigen por la legislación española. Cualquier controversia será resuelta en los tribunales de Catarroja, España.'
              : 'These terms are governed by Spanish law. Any dispute will be resolved in the courts of Catarroja, Spain.',
          },
        ].map((section, index) => (
          <View key={index}>
            <Text style={[styles.heading, { color: isDarkMode ? '#DC143C' : '#333' }]}>{section.title}</Text>
            <Text style={[styles.text, { color: isDarkMode ? '#AAA' : '#777' }]}>{section.content}</Text>
          </View>
        ))}

        {/* Política de Protección de Datos */}
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#DC143C' : '#333', marginTop: 30 }]}>
          {isSpanish ? 'Política de Protección de Datos de Love 4 Code' : 'Love 4 Code Data Protection Policy'}
        </Text>

        {[
          {
            title: isSpanish ? '1. Introducción' : '1. Introduction',
            content: isSpanish
              ? 'En Love 4 Code nos tomamos en serio la privacidad de nuestros usuarios y garantizamos la protección de sus datos personales conforme al GDPR.'
              : 'At Love 4 Code, we take our users’ privacy seriously and ensure the protection of their personal data in accordance with GDPR.',
          },
          {
            title: isSpanish ? '2. Datos Recopilados' : '2. Data Collected',
            content: isSpanish
              ? 'Recopilamos: \n- Datos de registro: Nombre, email, contraseña. \n- Datos de perfil: Tecnologías dominadas, experiencia laboral.'
              : 'We collect: \n- Registration data: Name, email, password. \n- Profile data: Technologies mastered, work experience.',
          },
          {
            title: isSpanish ? '3. Finalidad del Tratamiento' : '3. Purpose of Data Processing',
            content: isSpanish
              ? 'Utilizamos los datos recopilados para proporcionar y mejorar nuestros servicios, conectar a los usuarios y garantizar la seguridad.'
              : 'We use collected data to provide and improve our services, connect users, and ensure security.',
          },
          {
            title: isSpanish ? '4. Compartición de Datos' : '4. Data Sharing',
            content: isSpanish
              ? 'No compartimos datos personales con terceros, salvo cuando sea necesario para la prestación del servicio o exigido por ley.'
              : 'We do not share personal data with third parties except when necessary for service provision or required by law.',
          },
          {
            title: isSpanish ? '5. Seguridad de los Datos' : '5. Data Security',
            content: isSpanish
              ? 'Implementamos medidas de seguridad para proteger los datos contra accesos no autorizados, pérdida o alteración.'
              : 'We implement security measures to protect data against unauthorized access, loss, or alteration.',
          },
          {
            title: isSpanish ? '6. Derechos del Usuario' : '6. User Rights',
            content: isSpanish
              ? 'Los usuarios pueden ejercer sus derechos de acceso, rectificación y eliminación enviando un correo a love4codeapp@gmail.com.'
              : 'Users can exercise their rights of access, rectification, and deletion by sending an email to love4codeapp@gmail.com.',
          },
        ].map((section, index) => (
          <View key={index}>
            <Text style={[styles.heading, { color: isDarkMode ? '#DC143C' : '#333' }]}>{section.title}</Text>
            <Text style={[styles.text, { color: isDarkMode ? '#AAA' : '#777' }]}>{section.content}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#DC143C',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  bottomSpacing: {
    height: 50,
  },
});

export default TermsAndConditionsScreen;