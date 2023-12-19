import { StyleSheet, View, Appearance, useColorScheme } from 'react-native';
import { PaperProvider, Appbar, SegmentedButtons, FAB, TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { decode, encode } from 'base-64'
import { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [currentWindow, setCurrentWindow] = useState('code')
  const [code, setCode] = useState('')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [languageId, setLanguageId] = useState(71);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      language_id: languageId,
      source_code: code,
      stdin: input
    })
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'true',
        wait: 'true',
        fields: '*'
      },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.EXPO_PUBLIC_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        language_id: languageId,
        source_code: encode(code),
        stdin: encode(input)
      }
    };
    try {
      const response = await axios.request(options);
      setOutput(decode(response.data["stdout"]));
      setCurrentWindow('output');
    } catch (error) {
      console.error(error);
    }
  }

  const handleTabInput = (e) => {
    if (e.keyCode == 9) {
      e.preventDefault();
      setCode(code + '\t')
      return false;
    }
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header style={styles.appbar}>
            <SegmentedButtons
              style={styles.navbtns}
              value={currentWindow}
              onValueChange={setCurrentWindow}
              buttons={[
                {
                  value: 'code',
                  label: 'Code',
                },
                {
                  value: 'input',
                  label: 'Input',
                },
                { value: 'output', label: 'Output' },
              ]}
            />
            <Picker
              selectedValue={languageId}
              onValueChange={(itemValue, itemIndex) =>
                setLanguageId(itemValue)
              }>
              <Picker.Item label="Python" value="71" />
              <Picker.Item label="C++" value="54" />
              <Picker.Item label="C" value="50" />
              <Picker.Item label="Java" value="62" />
            </Picker>
          </Appbar.Header>
          <View style={styles.view}>
            {
              currentWindow == "code" && <TextInput name='input' value={code} onChangeText={text => setCode(text)} placeholder='Code' onKeyDown={e => handleTabInput(e)} multiline={true} />
            }
            {
              currentWindow == "input" && <TextInput name='input' value={input} onChangeText={text => setInput(text)} placeholder='Input' multiline={true} />
            }
            {
              currentWindow == "output" && <TextInput name='output' value={output} onChangeText={text => setOutput(text)} placeholder='Output' multiline={true} />
            }
          </View>
        </View>
        <FAB
          icon="play"
          style={styles.fab}
          onPress={handleSubmit}
        />
      </PaperProvider >

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
});
