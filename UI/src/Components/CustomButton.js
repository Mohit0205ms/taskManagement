import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";

const CustomButton = ({ 
  primaryButtonText, 
  secondaryButtonText, 
  primaryButtonAction, 
  secondaryButtonAction, 
  showPrimaryButton = false, 
  showSecondaryButton = false,
  isLoading = false,
}) => {
  return (
    <View style={styles.buttonContainer}>
      {showPrimaryButton && (
        <Button
          mode='contained'
          onPress={primaryButtonAction}
          style={[styles.button, styles.primaryButton]}
          labelStyle={styles.primaryButtonText}
          disabled={isLoading}
        >
          {!isLoading && primaryButtonText}
          {isLoading && <ActivityIndicator size='small' color='white' />}
        </Button>
      )}

      {showSecondaryButton && (
        <Button
          mode='outlined'
          onPress={secondaryButtonAction}
          style={[styles.button, styles.secondaryButton]}
          labelStyle={styles.secondaryButtonText}
          disabled={isLoading}
        >
          {!isLoading && secondaryButtonText}
          {isLoading && <ActivityIndicator size='small' color='white' />}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "column", // Stacks buttons if both are present
    width: "100%", // Takes full width of parent
    alignItems: "center", // Centers buttons
    marginTop: 20,
  },
  button: {
    width: "100%", // Full-width buttons
    borderRadius: 32,
    paddingVertical: 5,
  },
  primaryButton: {
    backgroundColor: "black",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "black",
    marginTop: 10, // Adds spacing between buttons
  },
  secondaryButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
