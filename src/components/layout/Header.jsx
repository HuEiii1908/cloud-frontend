import { Search, Settings, Grid3X3 } from "lucide-react";

export default function Header({ search, setSearch }) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">

      {/* SEARCH BAR */}
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Tìm trong Drive"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 bg-transparent outline-none flex-1 text-sm"
        />
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-4">
        <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-black" />
        <Grid3X3 className="w-6 h-6 text-gray-600 cursor-pointer hover:text-black" />

        {/* Avatar user */}
        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full cursor-pointer"
          alt="avatar"
        />
      </div>
    </header>
  );
}
