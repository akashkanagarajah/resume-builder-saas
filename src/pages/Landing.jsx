import UploadButton from "../components/UploadButton";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen justify-between items-center p-6 text-center">
      <main>
        <h1 className="text-4xl font-bold mb-8">Resume Builder SaaS</h1>
        <UploadButton />
      </main>
      <footer className="text-sm text-gray-500 mt-12">
        Built by Akash Kanagarajah
      </footer>
    </div>
  );
};

export default Landing;