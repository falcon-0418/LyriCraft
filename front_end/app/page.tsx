import Link from "next/link";
import SharedLayout from './layout/sharedLayout';

export default function Home() {
  return (
    <SharedLayout>
      <main>
        <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
          <div className="text-center">
            <h2 className="text-6xl text-gray-800 font-bold mb-8">LyriCraft</h2>
              <Link href="guest/Editor/">
                <span className="text-gray-700">始める</span>
              </Link>
          </div>
        </div>
      </main>
    </SharedLayout>
  );
}
