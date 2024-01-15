import Link from "next/link";
import SharedLayout from './layout/sharedLayout';

export default function Home() {
  return (
    <SharedLayout>
      <main>
        <div className="flex flex-col h-screen justify-center items-center">
          <div className="text-center">
            <h2 className="text-6xl font-bold mb-8">LyriCraft</h2>
              <Link href="Editor/">
                始める
              </Link>
          </div>
        </div>
      </main>
    </SharedLayout>
  );
}
