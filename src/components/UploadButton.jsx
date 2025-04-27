const keywords = ["Python", "React", "AWS", "JavaScript", "Leadership"];
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import * as pdfjsLib from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const UploadButton = () => {
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [matchedKeywords, setMatchedKeywords] = useState([]);

  async function extractTextFromPDF(file) {
    console.log('🔍 extractTextFromPDF called');

    try {
      const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
      const pdf = await loadingTask.promise;
      console.log('✅ PDF loaded. Total pages:', pdf.numPages);

      let text = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + ' ';
      }

      console.log('📄 Extracted PDF Text:\n\n', text);
      extractKeywords(text);
    } catch (error) {
      console.error('❌ Failed to load PDF:', error);
    }
  }

  function extractKeywords(resumeText) {
    const words = resumeText.toLowerCase().split(/\W+/);
    const foundKeywords = keywords.filter(keyword =>
      words.includes(keyword.toLowerCase())
    );
    console.log("📚 Found Keywords:", foundKeywords);
    setMatchedKeywords(foundKeywords);
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const isPDF = file.type === 'application/pdf';
    const isUnder5MB = file.size <= 5 * 1024 * 1024;

    if (!isPDF) {
      setIsShaking(true);
      setError('Only PDF files are accepted.');
      setFileName(null);
      setUploadedFile(null);
      setTimeout(() => {
        setIsShaking(false);
      }, 1500);
      return;
    }

    if (!isUnder5MB) {
      setIsShaking(true);
      setError('File size must be under 5MB.');
      setFileName(null);
      setUploadedFile(null);
      setTimeout(() => {
        setIsShaking(false);
      }, 1500);
      return;
    }

    setError(null);
    setFileName(file.name);
    setUploadedFile(file);
    setIsSuccessAnimated(true);
    setTimeout(() => {
      setIsSuccessAnimated(false);
    }, 1500);
    console.log('Uploaded file:', file);
    extractTextFromPDF(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className="w-full max-w-md border-2 border-dashed border-gray-400 p-8 rounded-lg text-center cursor-pointer hover:border-blue-500 transition"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-gray-600">
          <span className="text-3xl mb-2">⬇️</span>
          <p>
            {isDragActive
              ? "Drop the PDF here..."
              : "Drag & drop your resume here, or click to upload (PDF only)"}
          </p>
        </div>
      </div>

      {error && (
        <div
          key={error}
          className={`text-red-500 font-extrabold mt-2 transition-all duration-300 ${
            isShaking ? 'animate-shake text-5xl' : 'text-lg'
          }`}
        >
          {error}
        </div>
      )}

      {fileName && (
        <div
          className={`flex items-center gap-2 text-green-600 mt-2 font-semibold transition-all duration-300 ${
            isSuccessAnimated ? 'animate-shake text-2xl' : 'text-lg'
          }`}
        >
          <span className="text-lg">✔</span>
          <span>{fileName} uploaded successfully</span>
        </div>
      )}

      {matchedKeywords && (
        <div className="mt-6 w-full max-w-2xl text-center">
          <h2 className="text-xl font-bold mb-2">🔍 Matched Keywords:</h2>
          {matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {matchedKeywords.map((keyword, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No keywords matched.</p>
          )}
        </div>
      )}

      {uploadedFile && (
        <div className="w-full max-w-4xl mt-4">
          <iframe
            title="PDF Preview"
            src={URL.createObjectURL(uploadedFile)}
            className="w-full h-[85vh] border border-gray-300 rounded"
          ></iframe>
        </div>
      )}

      <button
        className={`mt-4 px-4 py-2 rounded text-white transition ${
          fileName
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!fileName}
      >
        Analyze Resume
      </button>
    </div>
  );
};

export default UploadButton;