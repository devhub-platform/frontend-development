import { UserPlus, UserRoundPen } from "lucide-react";

const users = [
  {
    name: "Sarah Chen",
    bio: "Full-stack engineer @TechCorp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    name: "Marcus Johnson",
    bio: "DevOps enthusiast | Cloud architect",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
  },
  {
    name: "Emily Rodriguez",
    bio: "React & Node.js developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
  },
];

export function SuggestedToFollow() {
  return (
    <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm mb-5">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-4 h-4 text-text-light" />
        <h2 className="text-gray-900">Suggested to Follow</h2>
      </div>

      
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.name} className="flex items-center gap-3">
      <div className="text-white overflow-hidden bg-primary rounded-full w-10 h-10 flex items-center justify-center">
        <UserRoundPen strokeWidth={3}/>
      </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 text-sm mb-0.5">{user.name}</h3>
              <p className="text-gray-500 text-xs line-clamp-1">{user.bio}</p>
            </div>
            
            <button
              size="sm"
              className="bg-primary hover:bg-text-light text-white text-xs px-3 h-7 rounded-full"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
