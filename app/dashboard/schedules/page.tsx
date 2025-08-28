import Navbar from "@/components/navbar";

export default function SchedulePage() {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Jadwal Pelajaran</h1>
        {/* Schedule content goes here */}
        <p>Ini adalah halaman Jadwal Pelajaran.</p>
      </main>
    </div>
  );
}
