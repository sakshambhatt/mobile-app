import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import Strings from '../../i18n/en';
import { AuthViewStyle } from './styles';
import { AuthScreenButton } from './Button';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { QrScannerModal } from '../../components/QrScannerModal';

const AuthScreen = () => {
  // const { setLoggedInUserData } = useContext(AuthContext);
  // const [githubView, setGithubView] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  // const [addressbarURL, setAdressbarURL] = useState<String>('');
  // const [loading, setLoading] = useState(false);
  // const [key, setKey] = useState(1);

  const openQrScanner = () => setIsQrScannerOpen(true);
  const closeQrScanner = () => setIsQrScannerOpen(false);

  const handleSignIn = () => {
    // NOTE: toast until sign in with Github is implemented
    Toast.show({
      type: 'info',
      text1: 'Sign in with GitHub coming soon...',
      position: 'bottom',
      bottomOffset: 80,
    });
  };

  //TODO: fix layout change on otp input
  return (
    <ScrollView contentContainerStyle={AuthViewStyle.container}>
      <View style={[AuthViewStyle.imageContainer]}>
        <Image
          source={require('../../../assets/rdsLogo.png')}
          style={AuthViewStyle.logo}
        />
      </View>
      <View style={[AuthViewStyle.constContainer]}>
        <Text style={AuthViewStyle.welcomeMsg}>{Strings.WELCOME_TO}</Text>
        <Text style={AuthViewStyle.cmpnyName}>{Strings.REAL_DEV_SQUAD}</Text>
      </View>
      <View style={AuthViewStyle.btnContainer}>
        <View style={AuthViewStyle.btnContainer}>
          <TouchableOpacity
            onPress={handleSignIn}
            style={AuthViewStyle.btnView}
          >
            <View style={AuthViewStyle.githubLogo}>
              <Image source={require('../../../assets/github_logo.png')} />
            </View>
            <View style={AuthViewStyle.signInTxtView}>
              <Text style={AuthViewStyle.signInText}>
                {Strings.SIGN_IN_BUTTON_TEXT}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <AuthScreenButton
          text={Strings.SIGN_IN_WITH_QR}
          onPress={openQrScanner}
        />
      </View>

      <QrScannerModal
        testId="qr-scanner"
        isQrScannerOpen={isQrScannerOpen}
        closeModal={closeQrScanner}
      />
    </ScrollView>
  );
};

export default AuthScreen;
