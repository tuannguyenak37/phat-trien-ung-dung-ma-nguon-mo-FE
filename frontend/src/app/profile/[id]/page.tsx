import Image from "next/image";
import Information from "./Information"; // Nhớ import đúng đường dẫn
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  HomeIcon, 
  MapPinIcon, 
  VideoCameraIcon, 
  PhotoIcon, 
  TagIcon 
} from "@heroicons/react/24/solid";
import Feed from "./Feed";
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

        <div className="md:col-span-7">
           <Feed userId={id} />
        </div>
      </div>
    </div>
  );
}