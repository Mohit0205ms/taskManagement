import React from "react";
import {View, Text, Image, StyleSheet} from 'react-native';
import { Images } from "../../assets";
import { getScreenWidth } from "../Utility/Utility";

const LogoSection = (props) =>{
  const {imageUri} = props;

  return (
    <View style={styles.container}>
      <Image source={imageUri || Images.logo} style={styles.imageStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: getScreenWidth() - 40,
    justifyContent:'center',
    alignItems: 'center',
    marginBottom: 10
  },
  imageStyle: {
    width: 200, 
    height: 200,
  }
})

export default LogoSection;
