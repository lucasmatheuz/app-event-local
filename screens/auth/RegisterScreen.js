import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Title, useTheme } from 'react-native-paper';
import { addUser, findUserByEmail } from '../../database/database';
import { Logo } from '../../components/Logo';
import StyledTextInput from '../../components/StyledTextInput';
import StyledButton from '../../components/StyledButton';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const theme = useTheme();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }
        try {
            if (await findUserByEmail(email)) {
                Alert.alert("Erro", "Este e-mail já está cadastrado.");
                return;
            }
            await addUser(name, email, password);
            Alert.alert("Sucesso", "Cadastro realizado! Faça o login para continuar.");
            navigation.goBack();
        } catch (err) {
            Alert.alert("Erro", "Não foi possível realizar o cadastro.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.content}>
                <Logo />
                <Title style={styles.title}>Criar Conta</Title>
                <StyledTextInput label="Nome Completo" value={name} onChangeText={setName} />
                <StyledTextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <StyledTextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
                <StyledButton onPress={handleRegister}>Cadastrar</StyledButton>
                <Button onPress={() => navigation.goBack()}>Já tenho uma conta</Button>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { justifyContent: 'center', padding: 20, width: '100%', height: '100%' },
    title: { textAlign: 'center', marginBottom: 24, fontSize: 24, color: '#333' },
});
