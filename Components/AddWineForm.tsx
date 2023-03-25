import * as React from 'react';
import {Image} from 'expo-image';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import MyDatabase from '../Database/MyDatabase';
import * as ImagePicker from 'expo-image-picker';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';


type AddWineFormProps = {
    navigation: StackNavigationProp<RootStackParamList, 'AddWineForm'>;
    route: RouteProp<RootStackParamList, 'AddWineForm'>;
};


export default function AddWineFom({navigation, route}: AddWineFormProps) {
    const [name, setName] = React.useState('');
    const [image, setImage] = React.useState('');
    const [color, setColor] = React.useState('');
    const [region, setRegion] = React.useState('');
    const [year, setYear] = React.useState('');
    const [grape, setGrape] = React.useState('');
    const [code, setCode] = React.useState('');
    const scannedData = route.params;
    const onAddWine = route.params;

    React.useEffect(() => {
        if (scannedData) {
            setCode(scannedData.toString());
        }

    }, [scannedData]);

    const addWine = () => {
        const wine = {name, image, color, region, year: Number(year), grape, code};
        console.log(wine);
        MyDatabase.addWineToDb(wine);
        onAddWine;
    };
    const navigateToScanner = () => {
        navigation.navigate('AddWineScanner');
    };
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (result.assets) {
            console.log(result.assets[0].uri);
        }
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            console.log('no pic choosen')
        }
    };

    async function takePicture() {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync({allowsEditing: true});
            if (!result.canceled) {
                setImage(result.assets[0].uri)
            }
        } else {
            console.log('Camera permission not granted');
        }
    }

    return (
        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.text}>Photo </Text>
                        {image ? <Image source={{uri: image}} style={styles.wineImg}/> :
                            <Image source={require("../assets/vinrouge.png")} style={styles.wineImg}/>}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Sélectionner une image" onPress={pickImage}/>
                        <Button title="Prendre une photo" onPress={takePicture}/>
                    </View>
                </View>
                <Button title="Scanner le code barre" onPress={navigateToScanner}/>
                {scannedData ? <Text>{scannedData.toString()}</Text> : <Text>No code</Text>}
                <View style={styles.rowInput}>
                    <Text style={styles.text}>Nom du vin *</Text>
                    <TextInput value={name} onChangeText={setName} placeholder="Nom du vin" style={styles.input}/>
                </View>
                <View style={styles.rowInput}>
                    <Text style={styles.text}>Robe *</Text>
                    <TextInput value={color} onChangeText={setColor} placeholder="Robe" style={styles.input}/>
                </View>
                <View style={styles.rowInput}>
                    <Text style={styles.text}>Région *</Text>
                    <TextInput value={region} onChangeText={setRegion} placeholder="Région" style={styles.input}/>
                </View>
                <View style={styles.rowInput}>
                    <Text style={styles.text}>Année de production *</Text>
                    <TextInput value={year} onChangeText={setYear} keyboardType={'numeric'} placeholder="Année"
                               style={styles.input}/>
                </View>
                <View style={styles.rowInput}>
                    <Text style={styles.text}>Cépage</Text>
                    <TextInput value={grape} onChangeText={setGrape} placeholder="Cépage" style={styles.input}/>
                </View>
                <View style={styles.submitContainer}>
                    <Button title="Ajouter le vin" onPress={addWine}/>
                </View>
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 30
    },
    input: {
        paddingHorizontal: 40,
        paddingVertical: 1,
        backgroundColor: "#F8F8F8",
        fontFamily: 'Rajdhani_700Bold',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#CBCBCB",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
        margin: 10,
    },
    wineImg: {
        width: 100,
        height: 130,
        borderWidth: 0,
        borderRadius: 8,
        borderColor: "#A0251D"
    },
    rowInput: {
        display: "flex",
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    rowContainer: {
        display: 'flex',
        flexDirection: "row",
        gap: 16,
        alignItems: 'center'
    },
    text: {
        fontFamily: 'Rajdhani_700Bold',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        paddingBottom: 8,
        alignItems: 'center'
    },
    submitContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 40
    }
});
