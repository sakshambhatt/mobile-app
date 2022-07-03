import React from 'react';
import { render } from '@testing-library/react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import HomeScreen from '../src/screens/HomeScreen/HomeScreen';
import Strings from '../src/i18n/en';
import { loggedInUserType } from '../src/context/type';
import { AuthContext } from '../src/context/AuthContext';
// import { storeData } from '../src/utils/dataStore';

const dummyLoggedInUserData = {
  id: '123abc',
  name: 'Jane Doe',
  profileUrl: 'https://via.placeholder.com/600/d32776',
  status: 'ooo',
};

function renderHomeScreen({
  initialLoggedInUserData,
}: {
  initialLoggedInUserData: loggedInUserType | null;
}) {
  const isLoading = false;
  const setIsLoading = () => {};

  let loggedInUserData = initialLoggedInUserData;
  const setLoggedInUserData = (userData: loggedInUserType | null) => {
    loggedInUserData = userData;
  };

  return render(
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        loggedInUserData,
        setLoggedInUserData,
      }}
    >
      <HomeScreen />
    </AuthContext.Provider>,
  );
}

describe('renders correctly', () => {
  test('renders I am OOO when loggedInUserData !null & status = OOO', () => {
    const { getByText } = renderHomeScreen({
      initialLoggedInUserData: {
        ...dummyLoggedInUserData,
        status: Strings.OUT_OF_OFFICE,
      },
    });
    getByText(Strings.OOOStatus_Text);
  });
  test('renders I am Idle when loggedInUserData !null & status = Idle', () => {
    const { getByText } = renderHomeScreen({
      initialLoggedInUserData: {
        ...dummyLoggedInUserData,
        status: Strings.IDLE,
      },
    });
    getByText(Strings.Idle_Text);
  });
  test('renders I am doing a task when loggedInUserData !null & status = Active', () => {
    const { getByText } = renderHomeScreen({
      initialLoggedInUserData: {
        ...dummyLoggedInUserData,
        status: Strings.ACTIVE,
      },
    });
    getByText(Strings.Active_Text);
  });
});

describe('changeStatus', () => {
  test('when status != OOO, changeStatus OOO, makes loggedInUserData.status OOO', async () => {});
  test.todo(
    'when status != Idle, changeStatus Idle, makes loggedInUserData.status Idle',
  );
  test.todo(
    'when status !=Active, changeStatus Active, makes loggedInUserData.status Active',
  );
});

describe('HomeScreen user operations', () => {
  test.todo('if status idle, change status to active');
  test.todo('if status active, change status to idle');
  test.todo('if status !OOO, mark yourself as OOO');
  test.todo('if status OOO, mark yourself active');
});
