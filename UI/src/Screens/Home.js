import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchAllTasks } from "../Utility/ApiCalling";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskList } from "../features/task/tasksSlice";

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tasks = useSelector((state)=> state.task.tasks);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const res = await fetchTasks();
    if(res){
      setRefreshing(false);
    }
  }, []);

  const getTrimmedDescription = (text, length = 60) =>
    text.length > length ? `${text.substring(0, length)}...` : text;

  const handlePress = () =>{
    navigation.navigate('AddTask');
  }

  const fetchTasks = async() => {
    const res = await fetchAllTasks();
    if(res.status >= 200 && res.status <= 209){
      const listOfTasks = res.data;
      dispatch(fetchTaskList({tasks: listOfTasks}));
      return true;
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
  }

  const handleDetailButtonClick = (item) => {
    navigation.navigate('TaskDetail',{id: item._id});
  }

  const renderItem = ({ item }) => {
    return (
      <Card style={styles.taskCard}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>
              {getTrimmedDescription(item.description)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={()=>handleDetailButtonClick(item)}
            style={styles.viewDetailButton}
          >
            <Text style={styles.viewDetailText}>View Details</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  };

  useEffect(()=>{
    fetchTasks();
  },[])

  if(tasks === null){
    return(
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title='My Tasks' showProfile={true} />
      {tasks.length > 0 && (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      )}
      {tasks.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 16,
              color: 'gray',
            }}
          >
            No tasks available. Start by adding a new task!
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Icon name='add' size={28} color='white' />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  taskCard: {
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
  },
  taskDescription: {
    color: "#666",
    fontSize: 14,
  },
  viewDetailButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "black",
  },
  viewDetailText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "black",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow on Android
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default Home;
