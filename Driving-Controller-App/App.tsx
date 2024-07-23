import * as Device from 'expo-device';
import { StyleSheet, Text, View, Platform, Pressable,Button, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import ServerConnection from './Screens/ServerConnection';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const Unsupported = () => { 

    return (
      <View >
        <Text style={styles.Message}>Sorry</Text>
        <Text style={styles.Message}>Device Accelerometer is not supported</Text>
        <Ionicons name="sad-outline" style={styles.Message}/>        
      </View>
    );
};

export default function App() {
  const [supported, setSup] = useState<boolean>(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();



  useEffect(() => { 
    const hardware = Device.getPlatformFeaturesAsync();
    hardware.then(response => {
      response.forEach(item => { 
         const sub = typeof item === 'string' ? item.toLowerCase() : ''; 
         if(sub.includes('accelerometer')){
          setSup(true);
         }
      })

      if(response.length < 1){ 
        const enabled = Accelerometer.isAvailableAsync();
        enabled.then(value => { 
          setSup(value);
        })
      }
    })

  }, []);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.Message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  return (
    <View style={[styles.container]}>
      <>
        {
        supported ? 
        <ServerConnection/> : 
          <Unsupported/>
        }
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  Message:  {
    width:430,
    textAlign:'center',
    fontSize:50, 
    fontWeight: '700', 

  }
});
