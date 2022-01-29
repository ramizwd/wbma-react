import React, {useContext} from 'react';
import {View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useLogin} from '../hooks/ApiHooks';
import {MainContext} from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Input} from 'react-native-elements';

const LoginForm = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useLogin();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const userData = await postLogin(data);
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Username"
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            leftIcon={{type: 'material-icons', name: 'lock'}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Password"
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="password"
      />

      <Button
        title="Submit"
        onPress={handleSubmit(onSubmit)}
        buttonStyle={{
          borderRadius: 6,
          marginHorizontal: 10,
        }}
      />
    </View>
  );
};

export default LoginForm;
