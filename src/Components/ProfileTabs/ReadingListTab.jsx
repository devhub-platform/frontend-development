import React from "react";
import { ChevronRight } from "lucide-react";

const ReadingListTab = ({ mockCollections }) => (
  <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
    <h3 className="mb-2 font-semibold text-2xl dark:text-white">
      Your Reading Lists
    </h3>
    {mockCollections.length > 0 ? (
      <div className="space-y-4">
        {mockCollections.map((collection) => (
          <article
            key={collection.id}
            className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-50 dark:border-0 cursor-pointer dark:bg-bg-secondary-dark dark:border-bg-secondary-dark"
          >
            <div className="p-6">
              {/* كود الـ UI الخاص بالـ Collection اللي كان في ملف البروفايل */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold dark:text-white">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {collection.description}
                  </p>
                </div>
                <ChevronRight
                  size={24}
                  className="text-gray-400 group-hover:text-primary"
                />
              </div>
              {/* الصور المصغرة */}
              <div className="flex items-center gap-4 pl-16">
                {collection.imgs.slice(0, 3).map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    className="w-50 h-35 rounded-lg object-cover"
                    alt="preview"
                  />
                ))}
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-primary to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </article>
        ))}
      </div>
    ) : (
      <p className="dark:text-white">No Reading Lists Yet.</p>
    )}
  </div>
);

export default ReadingListTab;
