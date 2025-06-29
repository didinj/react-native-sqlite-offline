import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from './components/ProductScreen';
import ProductDetailsScreen from './components/ProductDetailsScreen';
import ProductAddScreen from './components/ProductAddScreen';
import ProductEditScreen from './components/ProductEditScreen';
import { RootStackParamList } from './types/navigation'; // adjust path if needed
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Product"
          screenOptions={{
            headerStyle: { backgroundColor: '#777777' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />
          <Stack.Screen name="AddProduct" component={ProductAddScreen} />
          <Stack.Screen name="EditProduct" component={ProductEditScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
