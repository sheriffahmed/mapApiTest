import { useState, useEffect, useRef } from "react";
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

  const getLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync();
    await Location.useForegroundPermissions()
    let result = await Location.getForegroundPermissionsAsync();
    setAppLocation(result);
    return result;
  };

  const getCurrLoc = async () => {
    const location = await Location.getCurrentPositionAsync();
    setCurrLoc(location.coords);
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
    return {
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  };

  const handleRegionChange = (r) =>{
    setRegion(r);
  }

  useEffect(() => {
    getLocationPermission();
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
        region={region}
        onRegionChangeComplete={(region) => handleRegionChange(region)}
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
