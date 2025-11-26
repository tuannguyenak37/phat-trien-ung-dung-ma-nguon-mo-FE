import Image from "next/image";
import Information from "./[id]/Information"; // Nhớ import đúng đường dẫn
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  HomeIcon, 
  MapPinIcon, 
  VideoCameraIcon, 
  PhotoIcon, 
  TagIcon 
} from "@heroicons/react/24/solid";

// Định nghĩa kiểu params (Lưu ý: Next.js 15 params là Promise)
type Props = {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {
  // 1. Lấy ID từ URL (đợi params resolve)
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* --- PHẦN TRÊN: HEADER (Gọi component Client) --- */}
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-b-lg">
        {/* Truyền ID xuống component Information */}
        <Information id={id} />
      </div>

      {/* --- PHẦN DƯỚI: NỘI DUNG GRID (INTRO & FEED) --- */}
      <div className="max-w-6xl mx-auto mt-6 px-4 md:px-0 grid grid-cols-1 md:grid-cols-12 gap-6 pb-10">
        
        {/* CỘT TRÁI: INTRO */}
        <div className="md:col-span-5">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Intro</h2>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex items-center gap-3">
                <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                <span>Works at <strong>Stark Industries</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                <span>Studied at <strong>MIT</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <HomeIcon className="w-5 h-5 text-gray-400" />
                <span>Lives in <strong>San Francisco, CA</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <span>From <strong>New York, NY</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: POST FEED */}
        <div className="md:col-span-7">
          {/* Create Post */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                 <Image 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000" 
                  alt="Avatar Mini" 
                  width={40} height={40} 
                  className="object-cover h-full w-full"
                />
              </div>
              <input 
                type="text" 
                placeholder="What's on your mind?" 
                className="w-full bg-gray-100 rounded-full px-4 outline-none hover:bg-gray-200 transition cursor-pointer text-gray-700"
              />
            </div>
            <hr className="border-gray-200 mb-3" />
            <div className="flex justify-between px-2">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium text-sm transition">
                 <VideoCameraIcon className="w-6 h-6 text-red-500" />
                 <span className="hidden sm:inline">Live Video</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium text-sm transition">
                 <PhotoIcon className="w-6 h-6 text-green-500" />
                 <span className="hidden sm:inline">Photo/Video</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium text-sm transition">
                 <TagIcon className="w-6 h-6 text-blue-500" />
                 <span className="hidden sm:inline">Tag Friends</span>
              </button>
            </div>
          </div>
          
          {/* Post mẫu */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
             <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                   <Image 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000" 
                    alt="Avatar" 
                    width={40} height={40} 
                    className="object-cover h-full w-full"
                  />
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 text-sm">Alex Doe</h3>
                   <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
             </div>
             <p className="text-gray-800 text-sm mb-3">
               Just finished a great hiking trip! The views were absolutely breathtaking. 🏔️✨
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}