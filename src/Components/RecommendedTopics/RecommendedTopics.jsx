import { Lightbulb } from "lucide-react";

const topics = [
  { name: "System Design", followers: "45.2k" },
  { name: "React", followers: "89.1k" },
  { name: "Cloud Architecture", followers: "34.8k" },
  { name: "Artificial Intelligence", followers: "102.5k" },
  { name: "Career Development", followers: "28.3k" },
];

export function RecommendedTopics() {
  return <>
    <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm mb-5
                    dark:bg-bg-secondary-dark dark:border-gray-900  dark:shadow-gray-700/30">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-text-light dark:text-text-dark" />
        <h2 className="text-gray-900 dark:text-white">Recommended Topics</h2>
      </div>
      
      <div className="flex flex-col gap-1">
        {topics.map((topic) => (
          <a
            key={topic.name}
            href="#"
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group
                    dark:hover:bg-bg-primary-dark"
          >
            <span className="text-gray-700 group-hover:text-text-light transition-colors text-sm dark:text-gray-300 dark:group-hover:text-text-dark">
              {topic.name}
            </span>
            <span className="text-gray-400 text-xs">{topic.followers}</span>
          </a>
        ))}
      </div>
    </div>
  </>
}
