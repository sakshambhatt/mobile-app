import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen/HomeScreen';
import Strings from '../src/i18n/en';
import { loggedInUserType } from '../src/context/type';
import { AuthContext, AuthProvider } from '../src/context/AuthContext';
import axios from 'axios';
import { storeData } from '../src/utils/dataStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const dummyLoggedInUserData = {
  id: '123abc',
  name: 'Jane Doe',
  profileUrl: 'https://via.placeholder.com/600/d32776',
  status: 'ooo',
};

function renderCustomHomeScreen({
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
    const { getByText } = renderCustomHomeScreen({
      initialLoggedInUserData: {
        ...dummyLoggedInUserData,
        status: Strings.OUT_OF_OFFICE,
      },
    });
    getByText(Strings.OOOStatus_Text);
  });
  test('renders I am Idle when loggedInUserData !null & status = Idle', () => {
    const { getByText } = renderCustomHomeScreen({
      initialLoggedInUserData: {
        ...dummyLoggedInUserData,
        status: Strings.IDLE,
      },
    });
    getByText(Strings.Idle_Text);
  });
  test('renders I am doing a task when loggedInUserData !null & status = Active', () => {
    const { getByText } = renderCustomHomeScreen({
      initialLoggedInUserData: {
        ...dummyLoggedInUserData,
        status: Strings.ACTIVE,
      },
    });
    getByText(Strings.Active_Text);
  });
});

describe('HomeScreen user operations', () => {
  test('when status idle, change status to active', async () => {
    // store idle status in AsyncStorage
    storeData(
      'userData',
      JSON.stringify({
        ...dummyLoggedInUserData,
        status: Strings.IDLE,
      }),
    );

    const { getByText } = render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>,
    );

    expect(await waitFor(() => getByText(Strings.Idle_Text))).toBeTruthy();

    const changeStatusBtn = getByText(Strings.ActiveBtn_Text);

    mockedAxios.patch.mockResolvedValue({
      config: { data: { status: Strings.ACTIVE } },
    });

    fireEvent.press(changeStatusBtn);
    expect(await waitFor(() => getByText(Strings.Active_Text))).toBeTruthy();
  });

  test('when status ooo, mark yourself as active again', async () => {
    // store idle status in AsyncStorage
    storeData(
      'userData',
      JSON.stringify({
        ...dummyLoggedInUserData,
        status: Strings.OUT_OF_OFFICE,
      }),
    );

    const { getByText } = render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>,
    );

    expect(await waitFor(() => getByText(Strings.OOOStatus_Text))).toBeTruthy();

    const changeStatusBtn = getByText(Strings.OOOBtn2_Text);

    mockedAxios.patch.mockResolvedValue({
      config: { data: { status: Strings.ACTIVE } },
    });

    fireEvent.press(changeStatusBtn);
    expect(await waitFor(() => getByText(Strings.Active_Text))).toBeTruthy();
  });

  test('if status active, change status to idle', async () => {
    // store idle status in AsyncStorage
    storeData(
      'userData',
      JSON.stringify({
        ...dummyLoggedInUserData,
        status: Strings.ACTIVE,
      }),
    );

    const { getByText } = render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>,
    );

    expect(await waitFor(() => getByText(Strings.Active_Text))).toBeTruthy();

    const changeStatusBtn = getByText(Strings.IdleBtn_Text);

    mockedAxios.patch.mockResolvedValue({
      config: { data: { status: Strings.IDLE } },
    });

    fireEvent.press(changeStatusBtn);
    expect(await waitFor(() => getByText(Strings.Idle_Text))).toBeTruthy();
  });

  test('if status !OOO, mark yourself as OOO', async () => {
    // store idle status in AsyncStorage
    storeData(
      'userData',
      JSON.stringify({
        ...dummyLoggedInUserData,
        status: Strings.ACTIVE,
      }),
    );

    const { getByText } = render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>,
    );

    expect(await waitFor(() => getByText(Strings.Active_Text))).toBeTruthy();

    const changeStatusBtn = getByText(Strings.OOOBtn1_Text);

    mockedAxios.patch.mockResolvedValue({
      config: { data: { status: Strings.OUT_OF_OFFICE } },
    });

    fireEvent.press(changeStatusBtn);
    expect(await waitFor(() => getByText(Strings.OOOStatus_Text))).toBeTruthy();
  });
});
