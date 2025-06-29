import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  TextInput,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Database from '../Database';

const db = new Database();

type Props = NativeStackScreenProps<RootStackParamList, 'EditProduct'>;

const ProductEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const { prodId } = route.params;
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodPrice, setProdPrice] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    db.productById(prodId)
      .then(product => {
        setProdName(product.prodName);
        setProdDesc(product.prodDesc);
        setProdImage(product.prodImage);
        setProdPrice(product.prodPrice);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [prodId]);

  const updateProduct = () => {
    setIsLoading(true);
    const data = {
      prodId,
      prodName,
      prodDesc,
      prodImage,
      prodPrice,
    };
    db.updateProduct(prodId, data)
      .then(() => {
        setIsLoading(false);
        navigation.goBack();
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.activity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        <TextInput label="Product ID" value={prodId} mode="outlined" disabled />
      </View>
      <View style={styles.subContainer}>
        <TextInput
          label="Product Name"
          value={prodName}
          onChangeText={setProdName}
          mode="outlined"
        />
      </View>
      <View style={styles.subContainer}>
        <TextInput
          label="Product Description"
          value={prodDesc}
          onChangeText={setProdDesc}
          mode="outlined"
          multiline
          numberOfLines={4}
        />
      </View>
      <View style={styles.subContainer}>
        <TextInput
          label="Product Image URL"
          value={prodImage}
          onChangeText={setProdImage}
          mode="outlined"
        />
      </View>
      <View style={styles.subContainer}>
        <TextInput
          label="Product Price"
          value={prodPrice}
          onChangeText={setProdPrice}
          keyboardType="numeric"
          mode="outlined"
        />
      </View>
      <View style={styles.button}>
        <Button mode="contained" icon="content-save" onPress={updateProduct}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    alignSelf: 'center',
    width: '100%',
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductEditScreen;
