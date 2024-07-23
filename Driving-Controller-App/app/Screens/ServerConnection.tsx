import {Link, useGlobalSearchParams, useLocalSearchParams} from 'expo-router';
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StyleSheet, View, Button, Text, FlatList, TextInput, Pressable, Alert} from "react-native";

const evaluateConnection = (ip: string, port: number) => { 

}

export default function ServerConnection() { 
    const [title, setTitle] = useState<string>('Scan Servers'); 
    const [ipDirection, setIpDirection] = useState<string>('');
    const [portDirection, setPortDirection] = useState<string>('');
    const {data} = useGlobalSearchParams();

    useEffect(() => {
        if(data ){
            const casted = String(data);
            const splited = casted.split(':');
            console.log(splited);
            if(splited.length  <= 1) {
                Alert.alert("Invalid QR", "QR does not contain valid ip address" )
            } else {
                setIpDirection(String(splited.at(0)));
                setPortDirection(String(splited.at(1)));
            }
        }
    }, [])

    return (
        <View style={styles.mainView}>
            <Text style={styles.title}>{title}</Text>
              
            <View style={styles.container}>
                <TextInput 
                    placeholder="Ip Address"
                    value={ipDirection} 
                    onChangeText={(text) => setIpDirection(text)}
                    style={{padding:10, borderWidth:1, borderRadius:10, fontSize:40, fontWeight:'600', width:350}}
                    maxLength={15}
                    keyboardType="decimal-pad"                    

                    />
                <Text style={styles.title}>:</Text>
                <TextInput 
                    placeholder="Port" 
                    value={portDirection} 
                    onChangeText={(text) => setPortDirection(text)}
                    maxLength={4}
                    keyboardType="number-pad" 
                    style={{padding:10, borderWidth:1, borderRadius:10, fontSize:40, fontWeight:'600', width:150}}                  
                    />
                <Link href="/Screens/SteeringWheel"  onPress={() => { 
                    console.log(`data: ${data}`);
                    if(ipDirection.length && portDirection.length){
                        const ws = new WebSocket(`ws://${ipDirection}:${portDirection}`);
                        console.log(`${ipDirection}:${portDirection}`);
                        ws.onopen = () => { 
                            ws.send('Prueba');
                        }
                    }
                }}>
                    <Ionicons name='play-circle' size={50}/>
                </Link>
            </View>
            <Link href="/Screens/Scanner" >
                <View style={{borderWidth:1, alignItems:'center'}}>
                    <Ionicons name='scan' size={50}/>
                    <Text style={styles.title}> Scan address</Text>
                </View>
            </Link>

        </View>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex:1, 
        gap:20, 
        alignItems:'center'
    },
    container: { 
        width:'auto', 
        flexDirection:'row',
        alignItems:'center',
        verticalAlign:'middle',
        justifyContent:'space-between',
        gap:10
    },
    title: {
        fontSize:40, 
        fontWeight:'600', 

    }
});