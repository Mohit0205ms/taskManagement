import React, { useEffect, useMemo, useState } from "react";
import { Appbar, Modal, Portal, Text, Card } from "react-native-paper";
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getScreenHeight, getScreenWidth } from "../Utility/Utility";

const Header = ({ title, onBackPress, actions = [], showProfile = false, user = {}, style = {} }) => {
  const navigation = useNavigation();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [visible, setVisible] = useState(false);
  const customStyle = useMemo(() => {
    return style ? { ...styles.header, ...style } : styles.header;
  }, [style]);

  const toggleModal = () => {
    setVisible(!visible);
  };
  const handleLogout = async() => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
    setVisible(false);
  };

  const setUserDetail = async() => {
    const name = await AsyncStorage.getItem('name');
    const email = await  AsyncStorage.getItem('email');
    setName(name);
    setEmail(email);
  }

  useEffect(()=>{
    setUserDetail();
  },[])

  return (
    <>
      <Appbar.Header style={customStyle}>
        {onBackPress ? (
          <TouchableOpacity
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Appbar.BackAction color='white' />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Appbar.Content title={title} titleStyle={styles.title} />
        </View>

        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <Appbar.Action
              key={index}
              icon={action.icon}
              onPress={action.onPress}
              color='white'
            />
          ))}

          {showProfile && (
            <TouchableOpacity onPress={toggleModal}>
              <Appbar.Action icon='account-circle' color='white' />
            </TouchableOpacity>
          )}
        </View>
      </Appbar.Header>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={toggleModal}
          contentContainerStyle={styles.modalContainer}
          dismissable={true}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalBackground}>
              <Card style={styles.modalCard}>
                <Card.Content>
                  <Text style={styles.username}>{name || 'User Name'}</Text>
                  <Text style={styles.email}>
                    {email || 'user@example.com'}
                  </Text>
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.logoutButton}
                  >
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 6,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  placeholder: {
    width: 48,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width:getScreenWidth(),
    height: getScreenHeight(),
  },
  modalCard: {
    height: Platform.OS === 'ios' ? getScreenHeight() * 0.18 : 'auto',
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
