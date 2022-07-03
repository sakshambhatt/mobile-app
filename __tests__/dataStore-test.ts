import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { getData, storeData } from '../src/utils/dataStore';

const dummyLoggedInUserData = {
  id: '123abc',
  name: 'Jane Doe',
  profileUrl: 'https://via.placeholder.com/600/d32776',
  status: 'ooo',
};

afterEach(async () => {
  await AsyncStorage.clear();
});

describe('storeData', () => {
  test('storeData name, value stored in AsyncStorage', async () => {
    await storeData('userData', JSON.stringify(dummyLoggedInUserData));
    expect(AsyncStorage.setItem).toBeCalledWith(
      'userData',
      JSON.stringify(dummyLoggedInUserData),
    );
    const res = await AsyncStorage.getItem('userData');
    expect(res).toMatch(JSON.stringify(dummyLoggedInUserData));
  });
});

describe('getData', () => {
  test('getData("userData") returns parsed data stored in AsyncStorage', async () => {
    await AsyncStorage.setItem(
      'userData',
      JSON.stringify(dummyLoggedInUserData),
    );
    const res = await getData('userData');
    expect(AsyncStorage.getItem).toBeCalledWith('userData');
    console.log(res);
    expect(res).toMatchObject(dummyLoggedInUserData);
  });
});
