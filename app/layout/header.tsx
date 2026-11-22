export default function Header() {
  return (
    <header className="bg-linear-to-r from-indigo-200 to-fuchsia-400 shadow-md">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-wide text-white">
          TASK BOARD
        </h1>
        <p className="mt-1 text-sm text-indigo-100">
          Mengelola Tugas dan Proyek dengan Mudah
        </p>
      </div>
    </header>
  );
}