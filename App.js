import { useState, useEffect, useRef } from "react";
import MapView from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import * as Location from "expo-location";
// import * as Permissions from 'expo-permissions'

export default function App() {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const askPermission = Location.requestForegroundPermissionsAsync();
  const [appLocation, setAppLocation] = useState(undefined);
  const [currLoc, setCurrLoc] = useState({

      latitude: 33.64545041829775,
      longitude: -96.10110953450203,

  });
  const [ locationPermissionResponse, setLocationPermissionResponse ] = useState( '' )
  const [ hasLocationPermissions, setLocationPermission ] = useState( false )
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 33.64545041829775,
    longitude: -96.10110953450203,
    latitudeDelta: 82.20946758925375,
    longitudeDelta: 63.28125603497028,
  });
const [locationResult, setLocationResult] = useState(null)
const getCurrLoc = async () => {
    // await Location.useForegroundPermissions();
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

  const getLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync();
    console.log('line 22: ',await Location.requestForegroundPermissionsAsync());
     Location.useForegroundPermissions()
.then(()=> mapRef.current.animateToRegion(getCurrLoc(), 3 * 1000))
    console.log('line 24: ',await Location.useForegroundPermissions())
    let result = await Location.getForegroundPermissionsAsync();
    setAppLocation(result);

    mapRef.current.animateToRegion(getCurrLoc(), 3 * 1000)
    getCurrLoc();

    return result;
  };

  const usePermissions = async () => await Location.useForegroundPermissions()

  useEffect( () => {
    const getLocationAsync = async () => {
        // let { status } = await Permissions.askAsync( Permissions.LOCATION_FOREGROUND )
        let { status } = await Location.requestForegroundPermissionsAsync();
        if ( 'granted' !== status ) {
          setLocationPermissionResponse( 'Permission to access location was denied' )
          setLocationResult('Permission to access location was denied' )
        } else {
            setLocationPermission( true );

        }

        let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({})
        setLocationPermissionResponse( JSON.stringify( { latitude, longitude } ) )
        setLocationResult(JSON.stringify( { latitude, longitude } ) )

        // Center the map on the location we just fetched.
        setRegion( { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01} );
        // setRegion( { latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } );
        setCurrLoc({latitude, longitude })
    }

    getLocationAsync()
}, [] )

if ( locationResult === null ) {
    return <Text>Finding your current location...</Text>
}

if ( hasLocationPermissions === false ) {
    return <Text>Location permissions are not granted.</Text>
  }


if ( currLoc === null ) {
    return <Text>Current Location doesn't exist.</Text>
}

// if ( mapRegion === null ) {
//     return <Text>Map region doesn't exist.</Text>
// }


  // useEffect(() => {
  //   getLocationPermission();
  //   getCurrLoc();
  //   return () => {
  //     //cleanup
  //   };
  // }, []);

  // console.log("current location: ", currLoc, `region: `, region)

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <MapView
        ref={mapRef}
        style={styles.map}
        // initialRegion={{
        //   latitude: 33.64545041829775,
        //   longitude: -96.10110953450203,
        //   latitudeDelta: 82.20946758925375,
        //   longitudeDelta: 63.28125603497028,
        // }}
        region={region}
        onRegionChangeComplete={(region) => handleRegionChange(region)}
        // onRegionChange={ region => setRegion( region )}
        >
<MapView.Marker
                    title="Current Location"
                    description="Web Design and Development"
                    coordinate={currLoc}
                    // coordinate={{"latitude":currLoc.latitude,"longitude":currLoc.longitude}}
                    // coordinate={{"latitude":39.969183,"longitude":-75.133308}}
                />
        </MapView>

      <Button
        onPress={getCurrLoc}
        // onPress={() => mapRef.current.animateToRegion(getCurrLoc(), 3 * 1000)}
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
