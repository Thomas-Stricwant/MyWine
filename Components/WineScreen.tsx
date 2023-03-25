import * as React from 'react';
import {Button, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import MyDatabase from '../Database/MyDatabase';

type Props = {
    navigation: any;
    route: any;
    refreshList: () => void;
}

interface Wine {
    id: number;
    names: string;
    images: string;
    colors: string;
    regions: string;
    years: number;
    grapes: string;
    codes: string;
}

export default function WineScreen({route, navigation}: Props) {
    const [wines, setWines] = React.useState<Wine[]>([]);

    React.useEffect(() => {
        fetchWines();
    }, []);

    const fetchWines = () => {
        MyDatabase.getAllWines((result: Wine[]) => {
            setWines(result);
        });
    }
    const onAddWine = () => {
        fetchWines();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste de vos vins</Text>
            <Button title="Ajouter un vin" onPress={() => {
                navigation.navigate('Ajouter', {screen: 'Ajouter un vin', params: {onAddWine}});
            }}/>
            <FlatList
                data={wines}
                style={styles.flatList}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <View style={styles.card}>
                            {item.images === "" ?
                                <Image source={require("../assets/vinrouge.png")} style={styles.wineImg}/> :
                                <Image source={{uri: item.images}} style={styles.wineImg}/>}
                            <View style={styles.column}>
                                <Text style={styles.text}> Nom : {item.names}</Text>
                                <Text style={styles.text}> Robe : {item.colors}</Text>
                                <Text style={styles.text}> Région : {item.regions}</Text>
                                <Text style={styles.text}> Année : {item.years}</Text>
                                <Text style={styles.text}> Cépage : {item.grapes}</Text>
                                <Text style={styles.text}> Code : {item.codes}</Text>
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 23,
        paddingVertical: 15,
    },
    flatList: {
        width: '100%',
        paddingHorizontal: 15
    },
    item: {
        flex: 1,
        paddingVertical: 10,
        gap: 8,
        width: '100%',
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    card: {
        flex: 1,
        width: '100%',
        backgroundColor: "#f6f6f6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        elevation: 2,
    },
    column: {
        display: "flex",
        flexDirection: "column",
    },
    wineImg: {
        width: 100,
        height: 130,
        borderWidth: 0,
        borderRadius: 8,
        borderColor: "#A0251D"
    },
    text: {
        fontFamily: "Rajdhani_400Regular",
    },
});
