import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type Props = {
  navigation: any;
}

export default function Reviews({navigation}:Props ) {
    return (
      <View style={styles.container}>
        <Text>Reviews</Text>
        <Button
        title="Go to Wine... again"
        onPress={() => navigation.navigate('Wine')}
      />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });