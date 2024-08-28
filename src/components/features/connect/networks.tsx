const Networks = () => {
  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search networks..."
            className="w-full py-4 pl-4 pr-10 text-md bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-secondary transition-all duration-300"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Networks;
