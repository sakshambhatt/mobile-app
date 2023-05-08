import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Vibration,
  View,
  Text,
  Pressable,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import Toast from 'react-native-toast-message';
import Colors from '../../constants/colors/Colors';
import { useDeviceName, useManufacturer } from 'react-native-device-info';

type QrScannerModalProps = {
  testId: string;
  isQrScannerOpen: boolean;
  closeModal: () => void;
};

export function QrScannerModal({
  testId,
  isQrScannerOpen,
  closeModal,
}: QrScannerModalProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);
  const scannedCode = barcodes[0]?.displayValue;
  const isCameraViewOpen = device != null && hasPermission && !scannedCode;

  const deviceNameInfo = useDeviceName();
  const manufacturereInfo = useManufacturer();

  // Note: To get camera permission for QR scanner
  useEffect(() => {
    (async () => {
      if (isQrScannerOpen) {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
      }
    })();
  }, [isQrScannerOpen]);

  // Note: To perform side effects once qr code is scanned successfully
  useEffect(() => {
    if (isQrScannerOpen && scannedCode !== undefined) {
      Vibration.vibrate();

      Toast.show({
        type: 'success',
        text1: 'QR code scanned successfully!',
        text2: scannedCode,
        position: 'bottom',
        bottomOffset: 80,
        onPress: () => Toast.hide(),
      });

      // TODO: Post API call to send device info & scanned code
    }
  }, [closeModal, scannedCode, isQrScannerOpen]);

  return (
    <Modal
      transparent
      testID={testId}
      visible={isQrScannerOpen}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {isCameraViewOpen ? (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          ) : (
            <>
              <Text style={{ color: 'black', marginVertical: 10 }}>
                Device name:
                {` ${manufacturereInfo.result.toUpperCase()} - ${
                  deviceNameInfo.result
                }`}
              </Text>
              <Pressable
                style={{
                  backgroundColor: Colors.Primary_Color,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginVertical: 10,
                }}
              >
                <Text style={{ color: 'white' }}>Get status</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalView: {
    height: '50%',
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20,
  },
});
