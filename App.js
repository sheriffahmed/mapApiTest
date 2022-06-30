import { useState, useEffect, useRef } from "react";
// React from 'react';
import MapView from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const askPermission = Location.requestForegroundPermissionsAsync();
  const [appLocation, setAppLocation] = useState(undefined);
  const [currLoc, setCurrLoc] = useState({});
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 33.64545041829775,
    longitude: -96.10110953450203,
    latitudeDelta: 82.20946758925375,
    longitudeDelta: 63.28125603497028,
  });

  // "latitude": 33.64545041829775,
  // "latitudeDelta": 82.20946758925375,
  // "longitude": -96.10110953450203,
  // "longitudeDelta": 63.28125603497028,

  const getLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync();
    let result = await Location.getForegroundPermissionsAsync();
    setAppLocation(result);
    return result;
  };

  const getCurrLoc = async () => {
    const location = await Location.getCurrentPositionAsync();
    setCurrLoc(location.coords);

    // console.log(`line 31: `,currLoc)
    setRegion((prev) => {
      return {
        ...prev,
        latitudeDelta: 0.01,
    longitudeDelta: 0.01,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

    });
    await Location.useForegroundPermissions();
    mapRef.current.animateToRegion(
      {
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      3 * 1000
    );
    console.log(region);
    return {
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
    //  location;
  };

  const goToTokyo = () => {
    //Animate the user to new region. Complete this animation in 3 seconds
    mapRef.current.animateToRegion(tokyoRegion, 3 * 1000);
  };

  const handleRegionChange = (r) =>{
    setRegion(r);
    console.log('current regoin: ',r)
  }

  useEffect(() => {
    getLocationPermission();
    // if (appLocation === undefined) {
    // }
    getCurrLoc();
    return () => {
      //cleanup
    };
  }, []);

  return (
    <View style={styles.container}>
      {!currLoc
        ? null
        : console.log("current location: ", currLoc, `region: `, region)}
      <Text>Open up App.js to start working on your app!</Text>
      <MapView
        ref={mapRef}
        style={styles.map}
        // initialRegion={{
        //   latitude: 37.78825,
        //   longitude: -122.4324,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
        // initialRegion={region}
        region={region}
        onRegionChangeComplete={(region) => handleRegionChange(region)}
        // onRegionChangeComplete={(region) => setRegion(region)}
      />

      <Button
        onPress={() => mapRef.current.animateToRegion(getCurrLoc(), 3 * 1000)}
        title="Current Location"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
  },
});
