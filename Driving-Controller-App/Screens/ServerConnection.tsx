import {Link} from 'expo-router';
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StyleSheet, View, Button, Text, FlatList, TextInput, Pressable } from "react-native";

const evaluateConnection = (ip: string, port: number) => { 

}

export default function ServerConnection() { 
    const [title, setTitle] = useState<string>('Scan Servers'); 
    const [ipDirection, setIpDirection] = useState<string>('');
    const [portDirection, setPortDirection] = useState<string>('');
    const [hasPermission, setHasPermission] = useState(null);


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
                <Pressable onPress={() => { 
                    if(ipDirection.length && portDirection.length){
                        const ws = new WebSocket(`ws://${ipDirection}:${portDirection}`);
                        console.log(`${ipDirection}:${portDirection}`);
                        ws.onopen = () => { 
                            ws.send('Prueba');
                        }
                    }
                }}>
                    <Ionicons name='play-circle' size={50}/>
                </Pressable>
            </View>

            <View style={{borderWidth:1, alignItems:'center'}}>
                <Ionicons name='scan' size={50}/>
                <Text style={styles.title}> Scan address</Text>
            </View>

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