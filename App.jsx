import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Alert,
  View,
  Text,
  Button,
  ImageBackground,
  Platform,
} from 'react-native';
import P1HelloWorld from './components/Lab1_210425/Phan1/P1HelloWorld';
import P2CapturingTaps from './components/Lab1_210425/Phan1/P2CapturingTaps';
import P3CustomComponent from './components/Lab1_210425/Phan1/P3CustomComponent';
import P4StateProps from './components/Lab1_210425/Phan1/P4StateProps';
import P5Styling from './components/Lab1_210425/Phan1/P5Styling';
import P6ScrollableContent from './components/Lab1_210425/Phan1/P6ScrollableContent';
import P7BuildingAForm from './components/Lab1_210425/Phan1/P7BuildingAForm';
import P8LongLists from './components/Lab1_210425/Phan1/P8LongLists';

const projects = [
  {key: 'P1', title: 'Project 1: Hello World'},
  {key: 'P2', title: 'Project 2: Capturing Taps'},
  {key: 'P3', title: 'Project 3: Custom Component'},
  {key: 'P4', title: 'Project 4: State & Props'},
  {key: 'P5', title: 'Project 5: Styling'},
  {key: 'P6', title: 'Project 6: Scrollable Content'},
  {key: 'P7', title: 'Project 7: Building a Form'},
  {key: 'P8', title: 'Project 8: Long Lists'},
];

const menuBackgroundImage = require('./assets/bg.png');

const App = () => {
  // State để lưu trữ project đang được chọn
  const [selectedProject, setSelectedProject] = useState(null);

  // Hàm xử lý cho P3CustomComponent
  const handleFirstButtonPress = () => {
    Alert.alert('First Button Pressed!');
  };

  const handleSecondButtonPress = () => {
    Alert.alert('Second Button (Red) Pressed!');
  };

  // Hàm render nội dung project (không bao gồm menu)
  const renderProjectContent = () => {
    switch (selectedProject) {
      case 'P1':
        return <P1HelloWorld />;
      case 'P2':
        return <P2CapturingTaps />;
      case 'P3':
        return (
          <View style={styles.buttonContainer}>
            <P3CustomComponent
              text="Press Me (Default)"
              _onPress={handleFirstButtonPress}
            />
            <P3CustomComponent
              text="Press Me (Custom Style)"
              _onPress={handleSecondButtonPress}
              buttonStyle={styles.customButtonStyle}
            />
          </View>
        );
      case 'P4':
        return <P4StateProps />;
      case 'P5':
        return <P5Styling />;
      case 'P6':
        return <P6ScrollableContent />;
      case 'P7':
        return <P7BuildingAForm />;
      case 'P8':
        return <P8LongLists />;
      default:
        return null; // Không render gì nếu không có project nào được chọn
    }
  };

  // Render Menu Component với Background
  const renderMenu = () => (
    <ImageBackground
      source={menuBackgroundImage}
      style={styles.backgroundImage}>
      <View style={styles.menuOverlay}>
        {/* Lớp phủ tùy chọn để làm tối/mờ ảnh nền */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Select a Project:</Text>
          {projects.map(project => (
            <View key={project.key} style={styles.menuButton}>
              <Button
                title={project.title}
                onPress={() => setSelectedProject(project.key)}
              />
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedProject ? (
        <>
          <View style={styles.backButtonContainer}>
            <Button
              title="Back to Menu"
              onPress={() => setSelectedProject(null)}
            />
          </View>
          <View style={styles.projectContentContainer}>
            {renderProjectContent()}
          </View>
        </>
      ) : (
        // Hiển thị menu với background
        renderMenu()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  menuButton: {
    marginVertical: 9,
    width: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 15 : 55,
    left: 15,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  projectContentContainer: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 60 : 100,
  },
  buttonContainer: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  customButtonStyle: {
    backgroundColor: '#dc3545',
    borderColor: '#bd2130',
    borderWidth: 1,
  },
});

export default App;
