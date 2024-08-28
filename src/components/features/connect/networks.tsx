import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const Networks = () => {
  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search networks..."
            className="w-full py-4 pl-4 pr-10 text-md bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-primary transition-all duration-300"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
        </div>
      </div>
    </>
  );
};

export default Networks;
