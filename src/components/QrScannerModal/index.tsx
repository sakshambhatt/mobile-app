import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Vibration, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import Toast from 'react-native-toast-message';
import Colors from '../../constants/colors/Colors';

type QrScannerModalProps = {
  testId: string;
  visible: boolean;
  closeModal: () => void;
};

export function QrScannerModal({
  testId,
  visible,
  closeModal,
}: QrScannerModalProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  const scannedCode = barcodes[0]?.displayValue;

  useEffect(() => {
    (async () => {
      if (visible) {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
      }
    })();
  }, [visible]);

  useEffect(() => {
    if (visible && scannedCode !== undefined) {
      Vibration.vibrate();

      Toast.show({
        type: 'success',
        text1: 'QR code scanned successfully!',
        text2: scannedCode,
        position: 'bottom',
        bottomOffset: 80,
        onPress: () => Toast.hide(),
      });

      closeModal();
    }
  }, [closeModal, scannedCode, visible]);

  return (
    <Modal
      transparent
      testID={testId}
      visible={visible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {device != null && hasPermission ? (
            <>
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                frameProcessorFps={5}
              />
            </>
          ) : null}
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
    backgroundColor: Colors.Primary_Color,
  },
  modalView: {
    height: '50%',
    width: '100%',
    backgroundColor: Colors.Primary_Color,
    alignItems: 'center',
    paddingTop: 20,
  },
});
