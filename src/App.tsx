import Widget from "./components/widget";
import ThemeSelect from "./components/ui/theme-select";
import ModeToggle from "./components/ui/mode-toggle";
import { useAppStore } from "./store/useAppStore";

function App() {
  const isConnected = useAppStore((state) => state.isConnected);

  return (
    <main className="min-h-screen h-screen w-full flex flex-col bg-background gap-2">
      <div className="flex flex-col items-center h-full p-8">
        <h1 className="text-4xl font-bold text-text duration-300 text-center p-8">
          All demo, no bullshit
        </h1>
        <Widget />
        {!isConnected && (
          <div className="flex mt-12 items-center justify-center space-x-4">
            <ThemeSelect />
            <ModeToggle />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
