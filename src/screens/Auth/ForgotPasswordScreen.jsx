import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../context/AuthContext';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const {forgotPassword, authStatus} = useAuth();
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email của bạn.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập một địa chỉ email hợp lệ.');
      return;
    }

    setLocalSubmitting(true);
    try {
      await forgotPassword(email);
      Alert.alert(
        'Kiểm tra Email',
        `Nếu ${email} được liên kết với một tài khoản, một email hướng dẫn đặt lại mật khẩu đã được gửi.`,
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
      setEmail('');
    } catch (error) {
      Alert.alert(
        'Lỗi',
        error.message ||
          'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.',
      );
    } finally {
      setLocalSubmitting(false);
    }
  };

  const isProcessing = authStatus === 'processing' || localSubmitting;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Icon name="arrow-back-outline" size={28} color="#1A202C" />
      </TouchableOpacity>
      <Text style={styles.title}>Quên mật khẩu?</Text>
      <Text style={styles.subtitle}>
        Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên
        kết để đặt lại mật khẩu.
      </Text>

      <View style={styles.inputContainer}>
        <Icon
          name="mail-outline"
          size={22}
          color="#666"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isProcessing && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={isProcessing}>
        {isProcessing ? (
          <ActivityIndicator size="small" color="#1A202C" />
        ) : (
          <Text style={styles.buttonText}>Gửi Liên Kết Đặt Lại</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#f0f2f5',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 30,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: '#2D3748',
  },
  button: {
    backgroundColor: '#ffc107',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#ffc107',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    minHeight: 55,
  },
  buttonDisabled: {
    backgroundColor: '#ffe082',
  },
  buttonText: {
    color: '#1A202C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
