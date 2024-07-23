import { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, FlatList, TextInput } from "react-native";
import {WebSocket} from 'react-native-websocket'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';


const evaluateConnection = (ip: string, port: number) => { 

}

export default function ServerConnection() { 
    const [title, setTitle] = useState<string>('Scan Servers'); 
    const [ipDirection, setIpDirection] = useState<string>('');
    const [portDirection, setPortDirection] = useState<string>('');
    const [hasPermission, setHasPermission] = useState(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.container}>
              
                <View style={{flexDirection:'row', borderWidth:1, width:400, justifyContent:'center', gap:10}}>
                    <TextInput 
                        placeholder="Server Address"
                        value={ipDirection} 
                        onChangeText={(text) => setIpDirection(text)}
                        style={{padding:10, borderWidth:1, borderRadius:10}}
                        maxLength={15}
                        />
                    <Text>:</Text>
                    <TextInput 
                        placeholder="Server Port" 
                        value={ipDirection} 
                        onChangeText={(text) => setIpDirection(text)}
                        maxLength={5}                    
                        />

                </View>
                <Button title="Connect To Server" onPress={() => { 

                }}/>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex:1, 
        alignItems:'center',
        justifyContent:'flex-start',
        gap:40
    },
    title: {
        fontSize:40, 
        fontWeight:'600', 

    }
});