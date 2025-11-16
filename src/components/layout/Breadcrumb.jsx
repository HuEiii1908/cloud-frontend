
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useFile } from "../../hooks/useFile";

export default function Breadcrumb() {
  const { currentPath, navigateToPath, goToRoot } = useFile();
  const pathSegments = currentPath.split("/").filter(Boolean);

  const handlePathClick = (index) => {
    const newPath = pathSegments.slice(0, index + 1).join("/");
    navigateToPath(newPath);
  };

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
      <button
        onClick={goToRoot}
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-4 h-4" />
        Drive của tôi
      </button>

      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => handlePathClick(index)}
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
          >
            {segment}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
