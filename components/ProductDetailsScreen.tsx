import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Database, { Product } from '../Database';

const db = new Database();

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { prodId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();

  const fetchProduct = useCallback(() => {
    db.productById(prodId)
      .then(data => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [prodId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProduct);
    return unsubscribe;
  }, [navigation, fetchProduct]);

  const deleteProduct = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            db.deleteProduct(prodId)
              .then(() => navigation.goBack())
              .catch(err => {
                console.error(err);
                setIsLoading(false);
              });
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.activity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.activity}>
        <Text style={{ color: colors.error }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <View style={styles.subContainer}>
            <Image
              source={{ uri: product.prodImage }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.text}>Product ID: {product.prodId}</Text>
            <Text style={styles.text}>Product Name: {product.prodName}</Text>
            <Text style={styles.text}>Product Desc: {product.prodDesc}</Text>
            <Text style={styles.text}>Product Price: {product.prodPrice}</Text>
          </View>
          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              icon="pencil"
              style={styles.button}
              onPress={() =>
                navigation.navigate('EditProduct', { prodId: product.prodId })
              }
            >
              Edit
            </Button>
            <Button
              mode="contained"
              icon="delete"
              buttonColor={colors.error}
              textColor="#fff"
              style={styles.button}
              onPress={deleteProduct}
            >
              Delete
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  subContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonGroup: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

export default ProductDetailsScreen;
