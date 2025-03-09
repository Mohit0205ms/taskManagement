import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, Card } from "react-native-paper";
import Header from "../Components/Header";
import CustomButton from "../Components/CustomButton";
import { registerUser } from "../Utility/ApiCalling";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validatePassword = (password) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handleRegister = async() => {
    setErrorMessage("");

    if (!name.trim()) return setErrorMessage("Name is required.");
    if (!email.trim() || !validateEmail(email)) return setErrorMessage("Enter a valid Gmail email.");
    if (!password.trim() || !validatePassword(password)) 
      return setErrorMessage("Password must be 8+ characters, with 1 letter, 1 number, and 1 special character.");
    if (password !== confirmPassword) return setErrorMessage("Passwords do not match.");

    const res = await registerUser({name, email, password})
    if(res.status >= 200 && res.status <= 209){
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      navigation.navigate('Login');
    }
    else{
      if(res?.data?.error){
        alert(`${res?.data?.msg}`);
      }
      else{
        alert(`${res.msg}`);
      }
      return;
    }
  };
  const handleLoginClick = () =>{
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Sign Up" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
              <TextInput 
                label="Name"
                mode="outlined"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
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
              <TextInput 
                label="Confirm Password"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <CustomButton 
                primaryButtonText="Register" 
                primaryButtonAction={handleRegister} 
                showPrimaryButton={true} 
              />
              <Text style={styles.login} onPress={handleLoginClick}>login</Text>
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
    backgroundColor: "#F3F4F6",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 32,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  login: {
    color: 'black',
    textDecorationLine: 'underline',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default SignUp;
