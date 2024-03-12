import axiosInstance from '../editor/axiosConfig';
import { useRouter } from 'next/navigation';

interface UserProfileProps {
  userName: string;
  userEmail: string;
  setIsModalOpen: (isOpen: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, userEmail, setIsModalOpen }) => {

  const handleBackdropClick = () => {
    setIsModalOpen(false);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.delete('/authentication');
      sessionStorage.removeItem('accessToken');
      router.push('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out" onClick={handleBackdropClick}>
      <div
        className="absolute bg-white p-6 rounded-lg shadow-lg"
        style={{ top: '3rem', left: '0.5rem', width: '20rem' }}
        onClick={handleContentClick}
      >
        <h4 className="text-xl font-semibold mb-4 text-gray-500">プロフィール</h4>
        <p className='text-gray-500'>名前: {userName}</p>
        <p className='text-gray-500'>メール: {userEmail}</p>
        <button
          className="mt-4 text-red-500 hover:text-red-300 py-2 px-4 rounded"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default UserProfile;