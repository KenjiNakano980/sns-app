export function Pagination({ currentPage, setCurrentPage, totalPages }) {
  return (
    <div className="flex justify-center gap-3 mt-4">
      <button
        type="button"
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-white border rounded-lg disabled:opacity-50"
      >
        Previous
      </button>

      <span className="flex items-center">
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 bg-white border rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
