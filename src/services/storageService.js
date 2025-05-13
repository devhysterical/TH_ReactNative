import {Platform, Alert} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

export const choosePhotoAndGetBase64 = callback => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
    },
    response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        if (callback) callback({error: 'User cancelled'});
        return;
      }
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + response.errorMessage);
        if (callback) callback({error: response.errorMessage});
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.base64) {
          const base64StringSizeInBytes =
            asset.base64.length * (3 / 4) -
            (asset.base64.endsWith('==')
              ? 2
              : asset.base64.endsWith('=')
              ? 1
              : 0);
          const sizeLimitBytes = 700 * 1024; // Khoảng 700KB

          if (base64StringSizeInBytes > sizeLimitBytes) {
            const errorMsg = `Ảnh quá lớn (khoảng ${Math.round(
              base64StringSizeInBytes / 1024,
            )}KB). Vui lòng chọn ảnh nhỏ hơn ${Math.round(
              sizeLimitBytes / 1024,
            )}KB.`;
            Alert.alert('Lỗi kích thước', errorMsg);
            if (callback) callback({error: errorMsg});
            return;
          }
          if (callback) callback({uri: asset.uri, base64String: asset.base64});
        } else {
          const errorMsg = 'Không thể lấy dữ liệu Base64 từ ảnh đã chọn.';
          Alert.alert('Lỗi', errorMsg);
          if (callback) callback({error: errorMsg});
        }
      } else {
        const errorMsg = 'Không nhận được ảnh từ thư viện.';
        Alert.alert('Lỗi', errorMsg);
        if (callback) callback({error: errorMsg});
      }
    },
  );
};

export const takePhotoAndGetBase64 = callback => {
  launchCamera(
    {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
      saveToPhotos: false,
    },
    response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        if (callback) callback({error: 'User cancelled'});
        return;
      }
      if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Lỗi', 'Không thể chụp ảnh: ' + response.errorMessage);
        if (callback) callback({error: response.errorMessage});
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.base64) {
          const base64StringSizeInBytes =
            asset.base64.length * (3 / 4) -
            (asset.base64.endsWith('==')
              ? 2
              : asset.base64.endsWith('=')
              ? 1
              : 0);
          const sizeLimitBytes = 700 * 1024;

          if (base64StringSizeInBytes > sizeLimitBytes) {
            const errorMsg = `Ảnh quá lớn (khoảng ${Math.round(
              base64StringSizeInBytes / 1024,
            )}KB). Vui lòng chọn ảnh nhỏ hơn ${Math.round(
              sizeLimitBytes / 1024,
            )}KB.`;
            Alert.alert('Lỗi kích thước', errorMsg);
            if (callback) callback({error: errorMsg});
            return;
          }
          if (callback) callback({uri: asset.uri, base64String: asset.base64});
        } else {
          const errorMsg = 'Không thể lấy dữ liệu Base64 từ ảnh đã chụp.';
          Alert.alert('Lỗi', errorMsg);
          if (callback) callback({error: errorMsg});
        }
      } else {
        const errorMsg = 'Không nhận được ảnh từ camera.';
        Alert.alert('Lỗi', errorMsg);
        if (callback) callback({error: errorMsg});
      }
    },
  );
};
