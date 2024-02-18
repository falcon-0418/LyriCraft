import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 p-0 sm:p-2 z-40">
      <div className="flex flex-col sm:grid sm:grid-cols-3 items-center space-y-4 sm:space-y-0">
        <p className="order-last sm:order-first col-span-1 text-center sm:text-left text-sm">©︎ 2024 LyriCraft.com</p>
        <div className="flex flex-col sm:flex-row justify-end sm:col-span-2 space-y-1 sm:space-y-0 sm:space-x-10 pb-8 sm:pb-2">
          <Link href="/theme" className="text-[14px] text-gray-500 text-center sm:text-left">利用規約</Link>
          <Link href="/policy" className="text-[14px] text-gray-500 text-center sm:text-left">プライバシーポリシー</Link>
          <Link href="/contact_as" className="text-[14px] text-gray-500 text-center sm:text-left">お問い合わせ</Link>
        </div>
      </div>
    </footer>
  );
}