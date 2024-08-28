import ThemeSelect from "./components/ui/theme-select";
import Widget from "./components/widget";

function App() {
  return (
    <main className="min-h-screen h-screen w-full flex flex-col bg-background gap-2">
      <div className="flex flex-col items-center h-full gap-8 p-8">
        <Widget />
        <ThemeSelect />
      </div>
    </main>
  );
}

export default App;
