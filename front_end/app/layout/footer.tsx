import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex justify-between items-center p-4 bg-gray-100">
      <p className="text-center text-sm">©︎ 2024.LyriCraft.com</p>
        <div className="flex justify-end space-x-10 text-[14px]">
          <Link href="/theme">利用規約</Link>
          <Link href="/policy">プライバシーポリシー</Link>
          <Link href="contact_as">お問い合わせ</Link>
        </div>
    </footer>
  );
}