import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white border-b">
      <h1 className="text-2xl font-bold">LyriCraft</h1>
      <div className="flex space-x-4">
        <Link href="/login">ログイン</Link>
        <Link href="/signup">サインアップ</Link>
      </div>
    </header>
  );
}
