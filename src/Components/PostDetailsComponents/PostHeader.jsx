import { Calendar, Clock, Check } from 'lucide-react';
import { useState } from 'react';
import { posts } from '../../context/PostsData';

export function PostHeader({author, date, readingTime}) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 py-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <img
          src={posts.avatar}
          alt={posts.author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-bg-secondary-dark dark:text-gray-100">{author}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
            isFollowing
              ? 'text-text-light dark:text-text-dark bg-blue-50 border border-blue-200 hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              : 'text-white bg-primary hover:bg-text-light '
          }`}
        >
          {isFollowing && <Check className="w-4 h-4" />}
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors
                    dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
          Message
        </button>
      </div>
    </div>
  );
}