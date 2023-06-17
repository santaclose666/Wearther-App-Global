import React, {useState, useCallback} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [toggleIntro, setToggleIntro] = useState(true);
  const [handlePlaceholder, setHandlePlaceHolder] = useState(false);
  const [toggleErr, setToggleErr] = useState(false)

  const handleFocus = () => {
    setHandlePlaceHolder(false);
    setToggleErr(false)
  };

  const handleBlur = () => {
    setHandlePlaceHolder(true);
  };

  const apiKey = '1e52cb7b5a93a86d54181d1fa5724454';

  const fetchDataHandler = useCallback(async () => {
    if(input.length < 2){
      return Alert.alert("Enter at least 2 characters")
    }

    setLoading(true);
    setInput('');

    await axios({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}`,
    }).then((res) => {
      setData(res.data);
    }).catch(() => {
      setToggleErr(true)
      setData(false)
    });

    setLoading(false);
    setToggleIntro(false);
  }, [input]);

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('./assets/images/bg.png')}
        resizeMode="cover"
        blurRadius={25}
        style={styles.imageBackground}>
        <View>
          <TextInput
            placeholder={handlePlaceholder ? '' : 'Enter your City or Country'}
            onChangeText={(e) => setInput(e)}
            value={input}
            placeholderTextColor={'#000'}
            onSubmitEditing={fetchDataHandler}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={styles.textInput}
          />
        </View>
        {loading && (
          <View>
            <ActivityIndicator size={'large'} color="#000" />
          </View>
        )}

        {toggleIntro && (
          <View style={styles.introContainer}>
            <Text style={styles.appName}>Weather Application</Text>
            <Text style={styles.note}>
              Note: Input to text box to search weather information in your
              country{' '}
            </Text>
          </View>
        )}

        {toggleErr && (
          <Text style={styles.err}>Warning: Cannot found your City or Country!</Text>
        )}

        {data && (
          <View style={styles.inforWeather}>
            <Text style={styles.cityCountryText}>
              {`${data?.name}, ${data?.sys?.country}`}
            </Text>
            <Text style={styles.dateText}>{new Date().toDateString()}</Text>
            <Text style={styles.tempData}>
              {`${Math.round(data?.main?.temp - 273)} °C`}
            </Text>
            <Text style={styles.minMaxTemp}>
              {`Min: ${Math.round(
                data?.main?.temp_min - 273,
              )}°C / Max: ${Math.round(data?.main?.temp_max - 273)}°C`}
            </Text>
            <Text style={styles.humidity}>
              {`Humidity: ${data?.main?.humidity}%`}
            </Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    flex: 1,
  },

  imageBackground: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },

  textInput: {
    borderBottomWidth: 2,
    padding: 5,
    paddingVertical: 20,
    marginVertical: 100,
    marginHorizontal: 10,
    backgroundColor: '#ffff',
    fontSize: 19,
    borderRadius: 40,
    borderBottomColor: '#df8e00',
  },

  introContainer: {
    alignItems: 'center',
  },

  appName: {
    fontSize: 36,
    color: '#ffc9',
  },

  note: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textDecorationLine: 'underline',
    marginHorizontal: 10,
  },

  err: {
    alignItems: "center",
    fontSize: 36,
    color: "red",
    marginHorizontal: 20,
    textDecorationLine: 'underline',
  },

  inforWeather: {
    alignItems: 'center',
  },

  cityCountryText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },

  dateText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 20,
  },

  tempData: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },

  minMaxTemp: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 40,
  },

  humidity: {
    color: '#fff',
    fontSize: 30,
  },
});

export default App;
