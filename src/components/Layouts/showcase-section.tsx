import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PropsType = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function ShowcaseSection({ title, children, className }: PropsType) {
  const getSectionIcon = (title: string) => {
    if (title.toLowerCase().includes('team')) return '👥';
    if (title.toLowerCase().includes('candidate')) return '🎓';
    if (title.toLowerCase().includes('result')) return '🏆';
    if (title.toLowerCase().includes('search')) return '🔍';
    if (title.toLowerCase().includes('gallery')) return '📸';
    if (title.toLowerCase().includes('print')) return '🖨️';
    if (title.toLowerCase().includes('setting')) return '⚙️';
    if (title.toLowerCase().includes('form')) return '📝';
    if (title.toLowerCase().includes('report')) return '📊';
    if (title.toLowerCase().includes('management')) return '🎯';
    return '📋';
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-dark dark:border-gray-700">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 rounded-t-xl dark:border-gray-700">
        <h2 className="font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">{getSectionIcon(title)}</span>
          </div>
          <span className="text-lg">{title}</span>
        </h2>
      </div>

      <div className={cn("p-6", className)}>{children}</div>
    </div>
  );
}
