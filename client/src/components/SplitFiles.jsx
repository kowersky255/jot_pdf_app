import React, { useState } from "react";
import axios from "axios";

const SplitFiles = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a pdf file first.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("pdfFile", file);

    console.log(formData)

    try {
      const response = await axios.post(
        "http://localhost:5000/split-pdfs",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      //create a link to download zip file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "split_pdfs.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to process a PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-full items-center justify-center text-slate-700 dark:text-slate-100 dark:bg-slate-800">
      <section className="my-10 text-center w-full p-5 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-6 mb-4">
          Split PDF files
        </h1>
        <p className="text-lg md:text-xl mb-4">
          Separate one page or a whole set for easy conversion into independent
          PDF files.
        </p>
        <section className="cursor-pointer mb-4 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-lg p-8 text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-12 mx-auto text-slate-400 mb-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <label htmlFor="pdfFile">
            <span className="text-indigo-500 dark:text-sky-500 font-medium cursor-pointer">
              {file ? `${file.name}` : "Upload PDF file"}
            </span>
            <input
              type="file"
              name="pdfFile"
              id="pdfFile"
              accept="application/pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          <p>or drag and drop pdf files here</p>
        </section>
        <button
          onClick={handleUpload}
          className="text-2xl bg-gradient-to-r from-red-500 to-slate-600 text-white font-medium py-4 rounded-lg w-1/2"
        >
          {isLoading ? "Processing..." : "Split PDFs"}
        </button>
      </section>
    </section>
  );
};

export default SplitFiles;
