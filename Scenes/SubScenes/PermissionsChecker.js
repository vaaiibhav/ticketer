import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, PermissionsAndroid} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import NetInfo from '@react-native-community/netinfo';

const PermissionsChecker = ({children, onPermissionsGranted}) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showError, setShowError] = useState('');

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const internet = await NetInfo.fetch();
        if (!internet.isConnected) {
          Alert.alert('No Internet', 'Please enable internet connectivity');
          setShowError('No Internet. Please enable internet connectivity');
          return;
        }

        const permissions = [
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ];

        const results = await Promise.all(
          permissions.map(permission => check(permission)),
        );
        const allGranted = results.every(result => result === RESULTS.GRANTED);
        console.log('allGranted:', allGranted);

        if (allGranted) {
          setPermissionsGranted(true);
          onPermissionsGranted();
        } else {
          const requests = await Promise.all(
            permissions.map(permission => request(permission)),
          );
          console.log('requests:', requests);
          const allRequestsGranted = requests.every(
            result => result === RESULTS.GRANTED,
          );

          console.log('allRequestsGranted:', allRequestsGranted);
          if (allRequestsGranted) {
            setPermissionsGranted(true);
            onPermissionsGranted();
          } else {
            setShowError('Please grant permissions', allRequestsGranted);
            Alert.alert(
              'Permissions Required',
              'Please grant all permissions to continue',
            );
          }
        }
      } catch (error) {
        console.error('Permission check error', error);
        Alert.alert('Error', 'An error occurred while checking permissions');
        setShowError('Error: An error occurred while checking permissions');
      }
    };

    checkPermissions();
  }, []);

  // if (!permissionsGranted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>{showError}</Text>
  //       <Text style={styles.text}>Checking Permissions...</Text>
  //     </View>
  //   );
  // }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: 'red',
  },
});

export default PermissionsChecker;
