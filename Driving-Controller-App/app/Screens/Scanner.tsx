import { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import { CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';

export default function ReadUsingCamera() { 
    const [permission, requestPermission] = useCameraPermissions();
    const [data, setData] = useState<string>('');
    const router = useRouter();
     
    if (!permission?.granted) {
    // Camera permissions are not granted yet.
    return (
        <View style={styles.container}>
        <Text style={styles.Message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
        </View>
    );
    }

    return (
        <View style={{flex:1, flexDirection:'row', marginHorizontal:20, borderWidth:1}}>
            <View style={{flex:1, margin:20}}>
                <CameraView style={{flex:1}} facing='back'
                  barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    onBarcodeScanned={(result) => {
                        console.log(result.data);
                        setData(result.data);
                    }}
                > 
                </CameraView>

            </View>
            <View style={{flex:0.5, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:30, fontWeight:'500'}}>Scanned Data</Text>
                <Text style={{color:'black', fontSize:25, fontWeight:'400' }}>{data}</Text>
                <Button title="Use Data" onPress={() => {
                    router.push({pathname:'/', params:{data}})
                }}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
      borderWidth:0.5, 
      borderRadius:20,
      alignItems:'center',
      justifyContent: 'center',
    },
    Message:  {
      width:430,
      textAlign:'center',
      fontSize:50, 
      fontWeight: '700', 
  
    },
    cameraObjetive:{
        flex:1, 
        alignItems:'center', 
        justifyContent:'center', 
        borderWidth:3, 
        borderBottomEndRadius:10,
        margin:50, 
        borderColor:'white' 
    }

  });
  