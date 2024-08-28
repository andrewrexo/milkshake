import ModeToggle from "./components/ui/mode-toggle";
import ThemeSelect from "./components/ui/theme-select";
import Widget from "./components/widget";

function App() {
  return (
    <main className="min-h-screen h-screen w-full flex flex-col bg-background gap-2">
      <div className="flex flex-col items-center h-full p-8">
        <h1 className="text-4xl font-bold text-text duration-300 text-center p-4">All demo, no bullshit</h1>
        <Widget />
        <div className="flex mt-6 items-center justify-center space-x-4">
          <ThemeSelect />
          <ModeToggle />
        </div>
      </div>
    </main>
  );
}

export default App;
