import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const scrollViewRef = useRef(null);

  const handleTextSubmit = () => {
    if (inputText) {
      // Add user message to chat
      setChatMessages((prevMessages) => [...prevMessages, { text: inputText, isUser: true }]);
      setInputText('');
      // Send request to ChatGPT API and add response to chat
      sendRequest(inputText);
    }
  };
  useEffect(() => {
    // Introduce Maria when the app is opened for the first time
    const introduceMaria = () => {
      const introMessage = {
        text: 'Hello, I am Maria, your helpful assistant. How can I assist you today?',
        isUser: false,
      };
      setChatMessages([introMessage]);
    };

    introduceMaria();
  }, []); // Empty dependency array ensures this effect only runs once

  const sendRequest = async (userInput) => {
    try {
      // Construct the messages array including the user input
      const messages = [
        { role: 'system', content: 'You are Maria, a helpful assistant.' },
        { role: 'user', content: userInput },
      ];

      // If there are existing chat messages, append them to the messages array
      if (chatMessages.length > 0) {
        chatMessages.forEach((message) => {
          if (message.isUser) {
            messages.push({ role: 'user', content: message.text });
          } else {
            messages.push({ role: 'assistant', content: message.text });
          }
        });
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages,
        },
        {
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );

      const chatResponse = response.data.choices[0].message.content;

      // Add the ChatGPT's response to the chat messages
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: chatResponse, isUser: false },
      ]);
    } catch (error) {
      console.error('Failed to send request to ChatGPT API:', error);
    }
  };

  const MessageBubble = ({ text, isUser }) => {
    return (
      <View
        style={[
          styles.chatMessage,
          isUser ? styles.userChatMessage : styles.assistantChatMessage,
        ]}
      >
        <Text style={styles.chatMessageText}>{text}</Text>
      </View>
    );
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [chatMessages]);

  return (
  <ImageBackground 
  source={require('./assets/maria.jpg')} // Replace with your image path
  style={styles.backgroundImage}
  >
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>

      <View style={styles.chatContainer}>
        <ScrollView
          contentContainerStyle={styles.chatContentContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {chatMessages.map((message, index) => (
            <MessageBubble key={index} text={message.text} isUser={message.isUser} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleTextSubmit}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleTextSubmit}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: 'black',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'white',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatMessage: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userChatMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4285F4',
  },
  assistantChatMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F3F4',
  },
  chatMessageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   // marginTop: 20,
    marginBottom: 50,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default App;
