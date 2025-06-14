import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, Title, IconButton, Button } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { findUser } from '../../database/database';
import { Logo } from '../../components/Logo';
import StyledTextInput from '../../components/StyledTextInput';
import StyledButton from '../../components/StyledButton';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      if (compatible) {
          const hasStoredCreds = await SecureStore.getItemAsync('userCredentials');
          if (hasStoredCreds) {
              handleBiometricAuth();
          }
      }
    };
    checkBiometrics();
  }, []);

  const promptToEnableBiometrics = (user) => {
      Alert.alert( "Login Biométrico", "Deseja habilitar o login por biometria?",
          [
              { text: "Não", style: "cancel", onPress: () => login(user) },
              { text: "Sim", onPress: async () => {
                  try {
                      await SecureStore.setItemAsync('userCredentials', JSON.stringify({ email: user.email, password: user.password }));
                      Alert.alert("Sucesso!", "Login biométrico habilitado.");
                      login(user);
                  } catch (e) { login(user); }
              }}
          ]
      );
  };
  
  const handleLogin = async () => {
    try {
        const user = await findUser(email, password);
        if (user) {
          setError('');
          const hasStoredCreds = await SecureStore.getItemAsync('userCredentials');
          if (!hasStoredCreds) promptToEnableBiometrics(user);
          else login(user);
        } else {
          setError('Email ou senha inválidos.');
        }
    } catch (err) { setError("Ocorreu um erro. Tente novamente."); }
  };
  
  const handleBiometricAuth = async () => {
      if (!(await LocalAuthentication.isEnrolledAsync())) return;
      const credsString = await SecureStore.getItemAsync('userCredentials');
      if (!credsString) return;

      const authResult = await LocalAuthentication.authenticateAsync({ promptMessage: 'Faça login com sua biometria' });
      if (authResult.success) {
          const creds = JSON.parse(credsString);
          const user = await findUser(creds.email, creds.password);
          if (user) login(user);
      }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.content}>
        <Logo />
        <Title style={styles.title}>Bem-vindo ao Expo Go</Title>
        <StyledTextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <StyledTextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <StyledButton onPress={handleLogin}>Entrar</StyledButton>
        <Button textColor="#000000" onPress={() => navigation.navigate('Register')}>Não tem conta? Cadastre-se</Button>
        
        {isBiometricSupported && (
            <View style={styles.biometricContainer}>
                <Text style={styles.orText}>ou</Text>
                <IconButton icon="fingerprint" size={50} iconColor="#BB86FC" onPress={handleBiometricAuth} />
            </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  content: { justifyContent: 'center', padding: 20 },
  title: { textAlign: 'center', marginBottom: 24, fontSize: 28, color: '#000000', fontWeight: 'bold' },
  error: { color: '#B00020', textAlign: 'center', marginBottom: 10 },
  biometricContainer: { alignItems: 'center', marginTop: 20 },
  orText: { color: '#000000', fontWeight: 'bold' }
});