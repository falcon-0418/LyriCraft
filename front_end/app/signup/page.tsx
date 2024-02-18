"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '../login/googleLoginButton';
import axios from 'axios';
import SharedLayout from '../layout/sharedLayout';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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

      console.log(response.headers);

      const accessToken = response.headers['accesstoken'];
      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken);
      } else {
        console.log('アクセストークンがレスポンスに含まれていません。');
      }

      const userData = response.data.data;
      console.log('ユーザー名:', userData.attributes.name);
      console.log('ユーザーのEメール:', userData.attributes.email);
      console.log(accessToken)

      alert('登録しました。');
      // 登録後に別のページに遷移
      router.push('components/Editor/editor');
    } catch (error) {
      console.error('アカウント作成エラー:', error);
    }
  };

  return (
    <SharedLayout>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-6">アカウント作成</h2>
          {googleClientId && <GoogleLoginButton clientId={googleClientId} />}
        <hr className="my-4" />
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[300px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
              <a href="/terms" className="text-blue-600 hover:underline">
                プライバシー
              </a>
              と
              <a href='/terms' className="text-blue-600 hover:underline">
                利用規約
              </a>
              に同意します
            </label>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            アカウント作成
          </button>
        </form>
    </div>
    </SharedLayout>
  );
};

export default SignUpPage;
