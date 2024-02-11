import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-2xl font-bold p-2">LyriCraft</Link>
      <div className="flex space-x-4">
        <Link href="/login" className="text-gray-500 hover:bg-gray-200 p-2 rounded" >ログイン</Link>
        <Link href="/signup" className="text-gray-500 hover:bg-gray-200 p-2 rounded">サインアップ</Link>
      </div>
    </header>
  );
}
