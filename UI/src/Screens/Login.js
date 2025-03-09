import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, Card } from "react-native-paper";
import Header from "../Components/Header";
import CustomButton from "../Components/CustomButton";
import { generateOtp, loginUser } from "../Utility/ApiCalling";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleLogin = async() => {
    setErrorMessage("");

    if (!email.trim() || !validateEmail(email)) return setErrorMessage("Enter a valid Gmail email.");
    if (!password.trim()) return setErrorMessage("Password is required.");

    const res = await loginUser({email, password});

    if(res.status >= 200 && res.status <= 209){
      setEmail('');
      setPassword('');
      navigation.navigate('Home');
    }
    else{
      if(res?.data?.error){
        alert(`${res?.data?.msg}`)
      }
      else{
        alert(`${res?.msg}`);
      }
      return;
    }
  };
  const handleSignUpClick = () => {
    navigation.navigate('Signuo')
  }

  const handleResetPassword = async() => {
    try{
      navigation.navigate('OtpVerify');
    }catch(err){
      alert('something went wrong');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Login" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>

              <TextInput 
                label="Email"
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />

              <TextInput 
                label="Password"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <Text style={styles.signUp} onPress={handleResetPassword} >reset you password</Text>
              <CustomButton 
                primaryButtonText="Login" 
                primaryButtonAction={handleLogin} 
                showPrimaryButton={true} 
              />
              <Text style={styles.signUp} onPress={handleSignUpClick}>signUp</Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 32,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  signUp: {
    color: 'black',
    textDecorationLine: 'underline',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default Login;
