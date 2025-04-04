import { StatusBar } from 'expo-status-bar';
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View, Platform, Pressable, TouchableHighlight, Alert } from 'react-native';
import {Link, router, useGlobalSearchParams, useLocalSearchParams, useRouter} from 'expo-router';


const upperLimit: number = 0.190; 
const lowerLimit: number = -upperLimit;

type InclinationProps = {
  color: string
}

type OrientationProp = { 
  left: InclinationProps, 
  right: InclinationProps
}


export default function SteeringWheel() {
  const movements: Array<string> = ['Forward', 'Backward'];
  const [value, setValue] = useState<number>(0);
  const [gear, setGear] = useState<number>(0);
  const [inclination, setInclination] = useState<string>("");
  const [gearState, setGearState] = useState<string>(String(movements.at(0)));
  const {ipDirection, portDirection} = useGlobalSearchParams();

  const socket = useRef<WebSocket | null>(null);
 
  
  const EngineGear = () => {
    const position = (gear + 1) % 2; 
    const direction = movements.at(position);
    setGear(position);
    setGearState(String(direction));
  }
  const EnableAcelerometer = () => {
    const subscription = Accelerometer.addListener(DeviceAcelerometerData => {
      let value = DeviceAcelerometerData.y; 
      if(Platform.OS === 'ios'){
        value *= -1;
      }
      setValue(value);
    })
    Accelerometer.setUpdateInterval(100);
    return () => {
      subscription.remove();
    };
  }

  useEffect(() => {
    if(!value){
      EnableAcelerometer();
    }
    if(ipDirection && portDirection) { 
      socket.current = new WebSocket(`ws://${ipDirection}:${portDirection}`);
      // SendMessage('READY');
      return () => { 
        if(socket.current){
          socket.current?.close();
        }
      }
    }
  }, []);

 


  const SendMessage = (order: string) => { 
    if(socket.current && socket.current?.readyState === WebSocket.OPEN){
      socket.current.send(order);
    } else { 
      // Alert.alert('Server disconected', 'wou will be redirect to connection');
      // router.back();
      console.log('Disconectd');
    }
  }
  const DetermineColorInclination = (inclination: number): InclinationProps => {
    const result: InclinationProps = { 
      color: 'black'
    }
    const rounded = Number(inclination.toFixed(3));
    if(rounded >= lowerLimit && rounded <= upperLimit){
      result.color = 'green';
    }
    return result;
    
  }
  
  const DetermineInclination = (inclinationValue: number): string => { 
    const rounded = Number(inclinationValue.toFixed(3));
    let response: string = 'Neutral';
    if(rounded < lowerLimit){
      response = 'Left';
    }
  
    if(rounded > upperLimit){
      response = 'Right';
    }

    if(inclination !== response){
      setInclination(response);
      SendMessage(response)
    }
    return response;
  }

  const SendPedalMessage = (order: string) => { 
    let pedal = order;
    if(gear % 2 == 1){
      pedal = 'R' + order;
    }
    SendMessage(pedal);
  }
  
  const DetermineColorDirection = (inclination: number): OrientationProp => { 
    const rounded = Number(inclination.toFixed(3));
    const response: OrientationProp = { 
      left: {
        color: 'black'
      }, 
      right: {
        color: 'black'
      }
    }
  
    if(rounded < lowerLimit){
      response.left.color = 'green'
    }
  
    if(rounded > upperLimit){
      response.right.color = 'green'
    }
  
    return response;
  
  }
  
  const ColorGear = (status: number): InclinationProps => { 
    const style: InclinationProps = { 
      color:'black'
    };
  
    if(status % 2 === 1){
      style.color = 'red';
    }
    return style;
  }

  return (
    <View style={[styles.container]}>
      <Pressable onPress={() => {
        router.back();
        socket.current?.close();
      }}>
        <Ionicons size={50} color={"red"} style={[styles.directionIcon, {color:"red"}]} name='close'/>
      </Pressable>
      <StatusBar style="auto" />
      
      <View style={{flex: 0.5, alignItems:'center',justifyContent:'center'}}>
      
        <View style={styles.directionContainer}>
          <Ionicons size={70} style={[styles.directionIcon, DetermineColorDirection(value).left]} name='caret-back'/>
          <View >
          <Pressable onPress={EngineGear}>
            <Text style={[styles.inclination, ColorGear(gear)]}>{gearState}: </Text>
          </Pressable>
          <Text style={[styles.inclination,   DetermineColorInclination(value)]}>{DetermineInclination(value)}</Text>
          </View>
          <Ionicons size={70} style={[styles.directionIcon, DetermineColorDirection(value).right]} name='caret-forward'/>
        </View>
      
        <Text style={styles.inclinationValue}>{value.toFixed(2)}</Text>
      
      </View>
      
      <View style={styles.pedalsContainer}>
      
        <TouchableHighlight 
        style={styles.pedals}
        underlayColor="red"
        activeOpacity={0.6} 
        onPressIn={() => { 
          console.log(`Break from ${Platform.OS}`);
          SendMessage('Brake');
        }}
        onPressOut={() => { 
          console.log('Cancel Break');
          SendMessage('Brake-Cancel');
        }}
        >
          <Text style={[styles.inclination]}>Brake Pedal</Text>
        </TouchableHighlight>

        <TouchableHighlight 
        style={styles.pedals}
        underlayColor="green"
        activeOpacity={0.6} 
        onPressIn={() => {
          console.log(`Accelerator from ${Platform.OS}`);
          SendPedalMessage('Accelerator');
        }}
        onPressOut={() => {
          console.log('Cancel Accelerator');
          SendPedalMessage('Accelerator-Cancel');
        }}
        >
          <Text style={[styles.inclination]}>Accelerator Pedal</Text>
        </TouchableHighlight>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin:25,
  },
  directionContainer: {
    flexDirection:'row',
    justifyContent:'space-around',
    width:600,

  },
  inclination: {
    width:430,
    textAlign:'center',
    fontSize:50, 
    fontWeight: '700', 

  },
  inclinationValue: {
    fontSize:25, 
    fontWeight:'400'
  },
  directionIcon: { 
    opacity:0.5
  },
  pedals: {
    borderWidth:1, 
    width:'45%', 
    height:'100%', 
    margin:10, 
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
    opacity:0.6,
    backgroundColor:'#9B9B9B'
  },
  pedalsContainer: {
    flex:0.5,
    width:'100%',
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 

  }
});
