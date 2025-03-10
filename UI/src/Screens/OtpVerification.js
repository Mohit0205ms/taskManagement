import React, { useState, useRef, useEffect } from "react";
import { 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { Card } from "react-native-paper";
import CustomButton from "../Components/CustomButton";
import Header from "../Components/Header";
import { useNavigation } from "@react-navigation/native";
import { sendOtp, verifyOtp } from "../Utility/ApiCalling"; // Assuming API call for sending OTP

const OtpVerification = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const inputRefs = useRef([]);
  const [isLoadingPrimary, setIsLoadingPrimary] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [isResendDisabled,setIsResendDisabled] = useState(false);

  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // Handle Email OTP Sending
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const handleSendOtp = async () => {
    const isValid = await validateEmail(email);
    if (!isValid) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    try {
      const response = await sendOtp(email);
      if (response.status >= 200 && response.status <= 209) {
        setOtpSent(true);
        setErrorMessage("");
        setIsTimerActive(true);
      } else {
        alert(`${response.data.msg}`);
      }
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  // Handle OTP Input Change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    try {
      const enteredOtp = otp.join('');
      if (enteredOtp.length < 6) {
        setErrorMessage("Please enter a 6-digit OTP");
        return;
      }
      setErrorMessage("");
      setIsLoadingPrimary(true);
      const res = await verifyOtp(email, enteredOtp);
      if (res.status >= 200 && res.status <= 209) {
        setIsLoadingPrimary(false);
        navigation.navigate("ResetPassword",{email});
      } else {
        alert(`${res.msg}`);
        setIsLoadingPrimary(false);
      }
    } catch (err) {
      alert("Something went wrong");
      setIsLoadingPrimary(false);
    }
  };

  // Handle Backspace Key
  const handleBackspace = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      let newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  // Navigate Back
  const goBack = () => {
    navigation.goBack();
  };

  const handleResendOtp = async() => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0].focus();
    await handleSendOtp();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={otpSent ? 'OTP Verification' : 'Enter Email'} onBackPress={goBack} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              {!otpSent ? (
                // Email Input Section
                <>
                  <Text style={styles.title}>Enter Your Email</Text>
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                  {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                  <CustomButton 
                    primaryButtonText="Send OTP" 
                    primaryButtonAction={handleSendOtp} 
                    showPrimaryButton={true} 
                  />
                </>
              ) : (
                // OTP Input Section
                <>
                  <Text style={styles.title}>Enter OTP</Text>
                  <Text style={styles.subtitle}>We have sent a 6-digit code to your email.</Text>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(index, value)}
                        onKeyPress={(event) => handleBackspace(event, index)}
                      />
                    ))}
                  </View>
                  {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                  <CustomButton 
                    primaryButtonText="Verify OTP" 
                    primaryButtonAction={handleVerifyOtp} 
                    showPrimaryButton={true} 
                    isLoadingPrimary={isLoadingPrimary}
                  />
                  <Text style={styles.countdownText}>Resend OTP in {formatTime(countdown)}s</Text>
                  <TouchableOpacity onPress={handleResendOtp} disabled={isResendDisabled}>
                    <Text style={styles.resendOtp}>Resend OTP</Text>
                  </TouchableOpacity>
                </>
              )}
            </Card.Content>
          </Card>
        </View>
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
  container: {
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
    fontSize: 22,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    marginBottom: 15,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  resendOtp: {
    color: "black",
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 15,
  },
  countdownText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
});

export default OtpVerification;
