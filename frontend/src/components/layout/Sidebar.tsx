import Link from 'next/link';
import { 
  HomeIcon, 
  FireIcon, 
  HashtagIcon, 
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const menuItems = [
    { name: 'Home', icon: HomeIcon, href: '/' },
    { name: 'Popular', icon: FireIcon, href: '/popular' },
    { name: 'Topics', icon: HashtagIcon, href: '/topics' },
    { name: 'Discussions', icon: ChatBubbleLeftRightIcon, href: '/discussions' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 sticky top-20 h-[calc(100vh-5rem)] pr-6 py-4">
      {/* Call to Action */}
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-1 mb-8">
        <PlusIcon className="w-5 h-5" />
        <span>New Post</span>
      </button>

      {/* Navigation Menu */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</h3>
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Tags Section */}
      <div className="mt-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Trending Tags</h3>
        <div className="flex flex-wrap gap-2 px-2">
          {['#design', '#nextjs', '#uiux', '#creative'].map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;