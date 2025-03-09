
import { API_DOMAIN } from "@env";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// signUP
export const registerUser = async(userDetails) => {
  try {
    const url = `${API_DOMAIN}auth/signup`;
    const res = await axios.post(url, {
      name: userDetails.name,
      email: userDetails.email,
      password: userDetails.password,
    });
    return res;
  } catch (err) {
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "SignUp failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// login
export const loginUser = async(userDetails) => {
  try{
    const url = `${API_DOMAIN}auth/login`;
    console.log(url);
    const res = await axios.post(url,{
      email: userDetails.email,
      password: userDetails.password
    });
    if (res.status === 200) {
      const access_token = `${res?.data?.access_token}`;
      await AsyncStorage.setItem('userToken', access_token);
      await AsyncStorage.setItem('name', res.data?.name);
      await AsyncStorage.setItem('email', res.data?.email);
    }
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// add new task
export const addTask = async(taskDetail) =>{
  try{
    const url = `${API_DOMAIN}tasks`;
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.post(
      url,
      {
        title: taskDetail.title,
        desc: taskDetail.desc,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// fetch all tasks
export const fetchAllTasks = async() => {
  try{
    const url = `${API_DOMAIN}tasks`;
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.get(url,{
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

//  get specific task
export const specificTask = async(taskId)  => {
  try{
    const url = `${API_DOMAIN}tasks/${taskId}`;
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.get(url,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// update a task
export const editTask = async({id: taskId, title, desc }) => {
  try{
    const url = `${API_DOMAIN}tasks/${taskId}`;
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.put(
      url,
      {
        title: title,
        desc: desc,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// delete a task
export const deletePaticularTask = async(taskId) => {
  try{
    const url = `${API_DOMAIN}tasks/${taskId}`;
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.delete(url,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// generate otp
export const sendOtp = async(email) => {
  try{
    const url = `${API_DOMAIN}auth/generate/otp`;
    console.log(url);
    const res = await axios.post(url,{email},{
      headers:{
        'Content-Type': 'application/json',
      }
    });
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// verify otp
export const verifyOtp = async(email,otp) => {
  try{
    const url = `${API_DOMAIN}auth/verify/otp`;
    const res = await axios.post(url,{email,otp},{
      headers:{
        'Content-Type': 'application/json',
      }
    });
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
}

// reset password
export const resetPassword = async (password, email) => {
  try{
    const url = `${API_DOMAIN}auth/reset/password`;
    const res = await axios.post(url,{email,password},{
      headers:{
        'Content-Type': 'application/json',
      }
    });
    return res;
  }catch(err){
    if (err.response) {
      return { error: true, msg: err.response.data.msg || "Login failed" };
    } else if (err.request) {
      return { error: true, msg: "No response from server. Check your network." };
    } else {
      return { error: true, msg: err.message };
    }
  }
};
