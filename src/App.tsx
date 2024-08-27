import ThemeSelect from "./components/ui/theme-select";

function App() {
  return (
    <main className="min-h-screen h-screen w-full flex flex-col bg-background gap-2">
      <div className="flex flex-col items-center h-full">
        <h1 className="text-4xl font-bold text-text text-center p-8">
          All demo, no bullshit
        </h1>
        <div className="flex mt-12 items-center justify-center">
          <ThemeSelect />
        </div>
      </div>
    </main>
  );
}

export default App;
