"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SharedLayout from '../layout/sharedLayout';
import axios from 'axios';
import GoogleLoginButton from './googleLoginButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:3003/api/v1/authentication', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        console.log('ログイン成功:', response.data);

        const accessToken = response.headers['accesstoken'];
      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken);
      }

        alert('ログインしました。');
        router.push('components/Editor/editor');
      }
      } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage('メールアドレスまたはパスワードが間違っています。');
        console.error('ログインエラー:', error.response.data);
      } else {
        setErrorMessage('ログイン時にエラーが発生しました。');
        console.error('ログインエラー:', error);
      }
    }
  };

  return (
    <SharedLayout>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {errorMessage && <p className="text-red-500 mb-5">{errorMessage}</p>}
        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-6">ログイン</h2>
            {googleClientId && <GoogleLoginButton clientId={googleClientId} />}
        <hr className="my-4" />
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">メールアドレス</label>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[300px] px-4 py-2 border border-gray-300 placeholder-gray-400 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400 ">パスワード</label>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 placeholder-gray-400 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            ログイン
          </button>
        </form>
        {/* <div className="mt-4 text-center">
          <a href="/password-reset" className="text-blue-600 hover:underline">パスワードを忘れた場合</a>
        </div> */}
        <div className="mt-2 text-center">
          <a href="/signup" className="text-blue-600 hover:underline">サインアップ</a>
        </div>
    </div>
    </SharedLayout>
  );
};

export default LoginPage;