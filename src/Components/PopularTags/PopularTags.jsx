import { Tags } from "lucide-react";

const tags = [
  { name: "ai", count: 12543 },
  { name: "webdev", count: 10234 },
  { name: "javascript", count: 8932 },
  { name: "productivity", count: 7821 },
  { name: "design", count: 6745 },
  { name: "career", count: 5432 },
];

export function PopularTags() {
  return <>
    <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm mb-5
                    dark:bg-bg-secondary-dark dark:border-gray-900  dark:shadow-gray-700/30">
      <div className="flex items-center gap-2 mb-4">
        <Tags className="w-4 h-4 text-text-light dark:text-text-dark" />
        <h2 className="text-gray-900 dark:text-white">Popular Tags</h2>
      </div>
      
      <div className="flex flex-col gap-1">
        {tags.map((tag) => (
          <a
            key={tag.name}
            href="#"
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group
                    dark:hover:bg-bg-primary-dark"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-700 group-hover:text-text-light transition-colors dark:text-gray-300 dark:group-hover:text-text-dark">
                #{tag.name}
              </span>
            </div>
            <span className="text-gray-400 text-sm">{tag.count.toLocaleString()}</span>
          </a>
        ))}
      </div>
    </div>
  </>
}
