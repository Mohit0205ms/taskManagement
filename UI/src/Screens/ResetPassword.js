import React, { useReducer, useState } from "react";
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { Card, TextInput } from "react-native-paper";
import CustomButton from "../Components/CustomButton"; 
import Header from "../Components/Header"; 
import { useNavigation, useRoute } from "@react-navigation/native";
import { resetPassword } from "../Utility/ApiCalling";

const ResetPassword = () => {
  const navigation = useNavigation();
  const { email } = useRoute().params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingPrimary, setIsLoadingPrimary] = useState(false);

  const validatePassword = (password) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handleResetPassword = async() => {
    try {
      setErrorMessage('');
      if (!validatePassword(newPassword)) {
        setErrorMessage(
          'Password must be 8+ characters, with 1 letter, 1 number, and 1 special character.',
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      setIsLoadingPrimary(true);
      const res = await resetPassword(newPassword,email);
      if(res.status >= 200 && res.status <= 209){
        setIsLoadingPrimary(false);
        navigation.navigate('Login');
      }
      else{
        alert(`${res.msg}`);
        setIsLoadingPrimary(false);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
      setIsLoadingPrimary(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Reset Password" onBackPress={goBack} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>Reset Your Password</Text>
              <TextInput
                label="New Password"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                label="Confirm Password"
                mode="outlined"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <CustomButton 
                primaryButtonText="Reset Password" 
                primaryButtonAction={handleResetPassword} 
                showPrimaryButton={true} 
                isLoadingPrimary={isLoadingPrimary}
              />
              <Text style={styles.signUp} onPress={() => navigation.navigate("Login")}>
                Back to Login
              </Text>
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
    shadowOffset: { width: 0, height: 3 },
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
  signUp: {
    color: "black",
    textDecorationLine: "underline",
    alignSelf: "center",
    marginTop: 10,
  },
});

export default ResetPassword;
