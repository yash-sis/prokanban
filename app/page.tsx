import { Header } from "@/components/header";
import { ProjectBoard } from "@/components/project-board";
import { ProjectStats } from "@/components/project-stats";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 grid md:grid-cols-[1fr_400px] gap-6">
        <ProjectBoard />
        <ProjectStats />
      </main>
    </div>
  );
}
