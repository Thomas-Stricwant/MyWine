import * as React from 'react';
import {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import MyDatabase from "../Database/MyDatabase";
import QRCode from "react-native-qrcode-svg";


type Props = {
    navigation: any;
}

interface Wine {
    id: number;
    names: string;
    images: string;
    colors: string;
    country_id: number;
    region_id: number;
    years: number;
    grapes: string;
    quantities: number;
    reviews: string;
    ratings: number;
}

export default function WineShare({navigation}: Props) {
    const [wines, setWines] = React.useState<Wine[]>([]);
    const [qrCode, setQrCode] = React.useState<QRCode | null>();
    const qrRef = useRef(null);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e: any) => {
            MyDatabase.getAllWines((result: Wine[]) => {
                setWines(result);
            });
        });
        return unsubscribe;
    }, [navigation]);


    return (
        <View style={styles.container}>
            <QRCode value={JSON.stringify(wines)} getRef={(c) => (qrRef.current = c)} size={200}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
});