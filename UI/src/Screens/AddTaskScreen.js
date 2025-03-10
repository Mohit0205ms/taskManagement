import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, Card } from "react-native-paper";
import Header from "../Components/Header";
import CustomButton from "../Components/CustomButton";
import { addTask } from "../Utility/ApiCalling";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addTaskInList } from "../features/task/tasksSlice";

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingPrimary, setIsLoadingPrimary] = useState(false);

  const handleAddTask = async() => {
    setErrorMessage("");
    setIsLoadingPrimary(true);
    if (!title.trim()) return setErrorMessage("Title is required.");
    if (!description.trim()) return setErrorMessage("Description is required.");
    const res = await addTask({title,desc:description});
    if(res.status >= 200 && res.status <= 209){
      await dispatch(addTaskInList({task: res.data}));
      setTitle('');
      setDescription('');
      setIsLoadingPrimary(false);
      alert(`Task is added successfully`);
      navigation.goBack();
    }
    else{
      if(res?.data?.error){
        alert(`${res?.data?.msg}`)
      }
      else{
        alert(`${res?.msg}`);
      }
      setIsLoadingPrimary(false);
      return;
    }
  };

  const goBack = () => {
    console.log("heeloi")
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Add Task" onBackPress={goBack} showProfile={true} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>Create Task</Text>
              <TextInput 
                label="Task Title"
                mode="outlined"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput 
                label="Task Description"
                mode="outlined"
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <CustomButton 
                primaryButtonText="Add Task" 
                primaryButtonAction={handleAddTask} 
                showPrimaryButton={true} 
                isLoadingPrimary={isLoadingPrimary}
              />
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
  descriptionInput: {
    width: "100%",
    height: 120,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 32,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default AddTaskScreen;
