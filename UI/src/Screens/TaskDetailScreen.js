import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Text, TextInput, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import CustomButton from "../Components/CustomButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { deletePaticularTask, editTask, specificTask } from "../Utility/ApiCalling";
import { editTaskInList } from "../features/task/tasksSlice";
import { useDispatch } from "react-redux";

const TaskDetailScreen = () => {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  // Delete Confirmation
  const deleteTask = async() =>{
    try {
      const res = await deletePaticularTask(id);
      if (res.status >= 200 && res.status <= 209) {
        alert(`${res.data.msg} \n Pull to refresh list`);
        navigation.goBack();
        return;
      }
      if(res?.data?.error){
        alert(`${res?.data?.msg}`)
      }
      else{
        alert(`${res?.msg}`);
      }
    } catch (err) {
      
    }
  }
  const handleDeleteTask = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: deleteTask },
      ]
    );
  };

  const handleUpdateTask = async () => {
    try {
      const res = await editTask({id, title, desc: description});
      if(res.status >= 200 && res.status <= 209){
        setIsEditing(false);
        const task={
          id: id,
          title: res.data.title,
          desc: res.data.description
        }
        dispatch(editTaskInList({task}))
        navigation.navigate('Home');
        return;
      }
      if(res?.data?.error){
        alert(`${res?.data?.msg}`)
      }
      else{
        alert(`${res?.msg}`);
      }
    } catch (err) {

    }
  };

  const goBack = () => {
    navigation.goBack();
  }

  const fetchTask = async() => {
    const res = await specificTask(id);
    if(res.status >= 200 && res.status <= 209){
      setTask(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      return
    }
    if(res?.data?.error){
      alert(`${res?.data?.msg}\n Pull to refresh page`)
      navigation.goBack();
    }
    else{
      alert(`${res?.msg}\nPull to refresh page`);
      navigation.goBack();
    }
    return;
  }

  useEffect(()=>{
    fetchTask();
  },[id])

  if (task === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='black' />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Task Details" onBackPress={goBack} showProfile={true} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Task Details */}
        {!isEditing ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </Card.Content>
          </Card>
        ) : (
          // Edit Form
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Title"
                mode="outlined"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                label="Description"
                mode="outlined"
                style={[styles.input, styles.descriptionInput]}
                multiline
                value={description}
                onChangeText={setDescription}
              />
            </Card.Content>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <>
              <CustomButton
                secondaryButtonText="Delete Task"
                primaryButtonText="Edit Task"
                primaryButtonAction={() => setIsEditing(true)}
                secondaryButtonAction={handleDeleteTask}
                showPrimaryButton
                showSecondaryButton
              />
            </>
          ) : (
            <CustomButton
              primaryButtonText="Save Changes"
              primaryButtonAction={handleUpdateTask}
              showPrimaryButton
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  taskDescription: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 12,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});

export default TaskDetailScreen;
