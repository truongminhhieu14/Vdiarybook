export default function RightSideBar() {
  return (
    <aside className="w-72 bg-white rounded-xl shadow p-2 pt-16 ml-4 h-fit border border-gray-200">
      <div className="mb-2">
        <img src="https://file.apetavers.com/api/files/admin/20250630/8b8e773b-aee1-4321-86b5-1a09036c0fb9--1920.webp" className="w-full rounded" alt="banner" />
      </div>
      <div className="mb-2">
        <img src="https://file.apetavers.com/api/files/admin/20250618/674d883a-df87-45f2-b6bf-0f4718cf894e--1920.webp" className="w-full rounded" alt="banner" />
      </div>
      <div className="mb-4">
        <img src="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp" className="w-full rounded" alt="banner" />
      </div>
      <div>
        <div className="font-bold text-gray-700 mb-2">Friend</div>
        <div className="flex items-center mb-2">
          <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs mr-2">1</span>
          <span className="text-gray-700">Hung Pham</span>
          <span className="ml-auto text-xs text-gray-400">5:10 pm</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs mr-2">1</span>
          <span className="text-gray-700">Ai Gallery Store</span>
          <span className="ml-auto text-xs text-gray-400">4:16 pm</span>
        </div>
      </div>
    </aside>
  );
}