"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Next.jsのフックを使用
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert('利用規約に同意する必要があります。');
      return;
    }

    if (password !== confirmPassword) {
      alert('パスワードが一致しません。');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3003/api/v1/registration', {
        user: {
          name: username,
          email: email,
          password: password,
          password_confirmation: confirmPassword
        }
      });

      const userData = response.data.data;
      console.log('ユーザー名:', userData.attributes.name);
      console.log('ユーザーのEメール:', userData.attributes.email);

      alert('登録しました。');
      // 登録後に別のページに遷移
      router.push('/Editor');
    } catch (error) {
      console.error('アカウント作成エラー:', error);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold text-center mb-6">アカウント作成</h2>
        <button className="flex items-center justify-center w-full px-4 py-2 mb-4 text-white bg-red-500 rounded hover:bg-red-600">
          <FaGoogle className="mr-2" />
          Googleアカウントでサインアップする
        </button>
        <hr className="my-4" />
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Eメール"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="パスワード確認"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm">
              <a href="/terms" className="text-blue-600 hover:underline">プライバシーと利用規約</a>に同意します
            </label>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            アカウント作成
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
