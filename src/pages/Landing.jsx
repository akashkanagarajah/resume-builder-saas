import UploadButton from "../components/UploadButton";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header className="w-full sticky top-0 bg-white shadow-md py-4 px-6 text-xl font-bold text-gray-800 z-50 text-center">
        Smart Resume Analyzer 📄✨
      </header>

      <main className="flex-grow flex justify-center items-start p-6">
        <div className="w-full max-w-4xl">
          <UploadButton />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-4">
        Built with ❤️ by <a href="https://github.com/akashkanagarajah" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Akash Kanagarajah</a>
      </footer>
    </div>
  );
};

export default Landing;