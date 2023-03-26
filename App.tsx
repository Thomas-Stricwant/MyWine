import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './Components/Home';
import AddWineScanner from './Components/AddWineScanner';
import SuggestFood from './Components/SuggestFood';
import Reviews from './Components/Reviews';
import * as React from 'react';
import MyDatabase from './Database/MyDatabase';
import WineScreen from './Components/WineScreen';
import AddWineForm from './Components/AddWineForm';
import {useFonts} from "expo-font";
import {Rajdhani_400Regular, Rajdhani_700Bold} from "@expo-google-fonts/rajdhani";


const Tab = createBottomTabNavigator();

type StackParamList = {
    AddWineForm: { wineData?: string };
    AddWineScanner: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export type RootStackParamList = StackParamList & {
    Home: undefined;
    WineScreen: undefined;
    SuggestFood: undefined;
    Reviews: undefined;
};


function WineStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AddWineForm" component={AddWineForm} options={{
                title: "Ajouter un vin",
                headerTitleAlign: "center",
                headerTitleStyle: {fontFamily: "Rajdhani_700Bold", fontSize: 30, color: "white"},
                headerStyle: {backgroundColor: "#853832"}
            }}/>
            <Stack.Screen name="AddWineScanner" component={AddWineScanner} options={{
                title: "Scanner le code barre",
                headerTitleAlign: "center",
                headerTitleStyle: {fontSize: 28, color: "white"},
                headerStyle: {backgroundColor: "#853832"}
            }}/>
        </Stack.Navigator>
    );
}

export default function App() {


    React.useEffect(() => {
        MyDatabase.initDatabase();
    }, [])
    const [fontsLoaded] = useFonts({
        Rajdhani_700Bold,
        Rajdhani_400Regular,
    });
    console.log(fontsLoaded)
    if (!fontsLoaded) {
        return null;
    }
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Home" screenOptions={({route}) => ({
                tabBarIcon: ({color, size}) => {
                    let iconName;
                    if (route.name === 'Accueil') {
                        iconName = "home-circle-outline"
                    } else if (route.name === 'Mes vins') {
                        iconName = "glass-wine"
                    } else if (route.name == 'Ajouter') {
                        iconName = 'plus-circle'
                    } else if (route.name == 'Suggestions') {
                        iconName = 'pasta'
                    } else if (route.name == 'Mes avis') {
                        iconName = 'message-draw'
                    } else {
                        iconName = ''
                    }
                    return <Icon name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: '#dc143c',
                tabBarInactiveTintColor: 'black',
            })}>
                <Tab.Screen name="Accueil" component={Home} options={{
                    headerTitleAlign: "center",
                    tabBarLabelStyle: {fontFamily: "Rajdhani_700Bold"},
                    headerTitleStyle: {fontFamily: "Rajdhani_700Bold", fontSize: 30, color: "white"},
                    headerStyle: {backgroundColor: "#853832"}
                }}/>
                <Tab.Screen name="Mes vins" component={WineScreen} options={{
                    headerTitleAlign: "center",
                    tabBarLabelStyle: {fontFamily: "Rajdhani_700Bold"},
                    headerTitleStyle: {fontFamily: "Rajdhani_700Bold", fontSize: 30, color: "white"},
                    headerStyle: {backgroundColor: "#853832"}
                }}/>
                <Tab.Screen name="Ajouter" component={WineStack} options={{
                    headerShown: false,
                    tabBarLabelStyle: {fontFamily: "Rajdhani_700Bold"},
                }}/>
                <Tab.Screen name="Suggestions" component={SuggestFood} options={{
                    headerTitleAlign: "center",
                    tabBarLabelStyle: {fontFamily: "Rajdhani_700Bold"},
                    headerTitleStyle: {fontFamily: "Rajdhani_700Bold", fontSize: 30, color: "white"},
                    headerStyle: {backgroundColor: "#853832"}
                }}/>
                <Tab.Screen name="Mes avis" component={Reviews} options={{
                    headerTitleAlign: "center",
                    tabBarLabelStyle: {fontFamily: "Rajdhani_700Bold"},
                    headerTitleStyle: {fontFamily: "Rajdhani_700Bold", fontSize: 30, color: "white"},
                    headerStyle: {backgroundColor: "#853832"}
                }}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
