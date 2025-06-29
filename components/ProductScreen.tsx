import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Database, { Product } from '../Database';

const db = new Database();

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

const ProductScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [notFound] = useState(
    'Products not found.\nPlease click (+) button to add it.',
  );
  const { colors } = useTheme();

  const getProducts = useCallback(() => {
    db.listProduct()
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      getProducts();
    });
    return unsubscribe;
  }, [navigation, getProducts]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Product List',
      headerRight: () => (
        <IconButton
          icon="plus-circle"
          iconColor={colors.primary}
          size={28}
          onPress={() => navigation.navigate('AddProduct')}
        />
      ),
    });
  }, [navigation, colors]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('ProductDetails', {
          prodId: item.prodId,
        })
      }
    >
      {item.prodImage ? (
        <Image source={{ uri: item.prodImage }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>{item.prodName[0]}</Text>
        </View>
      )}
      <Text style={styles.itemText}>{item.prodName}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.activity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>{notFound}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.prodId}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  message: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  itemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProductScreen;
