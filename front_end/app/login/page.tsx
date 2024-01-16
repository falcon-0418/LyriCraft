"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

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
        alert('ログインしました。');
        router.push('/Editor');
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {errorMessage && <p className="text-red-500 mb-5">{errorMessage}</p>}
      <div className="p-6 bg-white shadow-md rounded">
        <h2 className="text-4xl font-bold text-center mb-6">ログイン</h2>
        <button className="flex items-center justify-center w-full px-4 py-2 mb-4 text-white bg-red-500 rounded hover:bg-red-600">
          <FaGoogle className="mr-2" />
          Googleアカウントでログインする
        </button>
        <hr className="my-4" />
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            ログイン
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/password-reset" className="text-blue-600 hover:underline">パスワードを忘れた場合</a>
        </div>
        <div className="mt-2 text-center">
          <a href="/signup" className="text-blue-600 hover:underline">サインアップ</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;