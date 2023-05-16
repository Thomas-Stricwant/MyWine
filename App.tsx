import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './Views/Home';
import AddWineScanner from './Views/AddWineScanner';
import SuggestFood from './Views/SuggestFood';
import Reviews from './Views/Reviews';
import * as React from 'react';
import MyDatabase from './Database/MyDatabase';
import WineScreen from './Views/WineScreen';
import WineScanner from './Views/WineScanner';
import AddWineForm from './Views/AddWineForm';
import {useFonts} from "expo-font";
import {Rajdhani_400Regular, Rajdhani_700Bold} from "@expo-google-fonts/rajdhani";
import WineShare from "./Views/WineShare";
import {RootSiblingParent} from 'react-native-root-siblings';


const Tab = createBottomTabNavigator();
const AddStack = createNativeStackNavigator<StackParamList>();
const WineStack = createNativeStackNavigator<WineStackParamList>();

type StackParamList = {
    AddWineForm: { wineData?: string };
    AddWineScanner: undefined;
};

type WineStackParamList = {
    WineScreen: undefined;
    WineScanner: undefined;
    WineShare: undefined;
};

export type RootStackParamList = StackParamList & {
    Home: undefined;
    WineScreen: undefined;
    SuggestFood: undefined;
    Reviews: undefined;
};


function AddWineStack() {
    return (
        <AddStack.Navigator>
            <AddStack.Screen name="AddWineForm" component={AddWineForm} options={{
                title: "Ajouter un vin",
                headerTitleAlign: "center",
                headerTitleStyle: {fontFamily: "Rajdhani_700Bold", fontSize: 30, color: "white"},
                headerStyle: {backgroundColor: "#853832"}
            }}/>
            <AddStack.Screen name="AddWineScanner" component={AddWineScanner} options={{
                title: "Scanner le code barre",
                headerTitleAlign: "center",
                headerTintColor: "white",
                headerTitleStyle: {fontSize: 28, color: "white"},
                headerStyle: {backgroundColor: "#853832"}
            }}/>
        </AddStack.Navigator>
    );
}

function WineScreenStack() {
    return (
        <WineStack.Navigator>
            <WineStack.Screen name="WineScreen" component={WineScreen} options={{
                title: "Mes vins",
                headerTitleAlign: "center",
                headerTitleStyle: {fontFamily: "Rajdhani_700Bold", fontSize: 30, color: "white"},
                headerStyle: {backgroundColor: "#853832"}
            }}/>
            <WineStack.Screen name="WineScanner" component={WineScanner} options={{
                title: "Scanner",
                headerTintColor: "white",
                headerTitleAlign: "center",
                headerTitleStyle: {fontSize: 28, color: "white"},
                headerStyle: {backgroundColor: "#853832"}
            }}/>
            <WineStack.Screen name="WineShare" component={WineShare} options={{
                title: "Partager",
                headerTintColor: "white",
                headerTitleAlign: "center",
                headerTitleStyle: {fontSize: 28, color: "white"},
                headerStyle: {backgroundColor: "#853832"}
            }}/>
        </WineStack.Navigator>
    );
}

export default function App() {
    const [dbCreated, setDbCreated] = React.useState(false);


    React.useEffect(() => {
        if (!dbCreated) {
            MyDatabase.initDatabase();
            MyDatabase.initCountriesDatabase();
            MyDatabase.initRegionsDatabase();
            MyDatabase.initDishesDatabase();
            MyDatabase.addCountriesAndWineRegions();
            MyDatabase.addDishes();
            setDbCreated(true);
        }
    }, [])


    const [fontsLoaded] = useFonts({
        Rajdhani_700Bold,
        Rajdhani_400Regular,
    });
    if (!fontsLoaded) {
        return null;
    }
    return (
        <RootSiblingParent>
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
                    <Tab.Screen name="Mes vins" component={WineScreenStack} options={{
                        headerShown: false,
                        tabBarLabelStyle: {fontFamily: "Rajdhani_700Bold"},
                    }}/>
                    <Tab.Screen name="Ajouter" component={AddWineStack} options={{
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
        </RootSiblingParent>

    );
}
