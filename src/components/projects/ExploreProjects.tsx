"use client"
import Link from "next/link";
import ProjectHeaderSection from "./ProjectHeaderSection"
import ProjectSearchFilterSection from "./ProjectSearchFilterSection";
import PublicProjectsPage from "./PubicProjects";
import { useRouter } from "next/navigation";

const ExploreProjects = () => {
  const router = useRouter();
  return (
    <div>
      <ProjectHeaderSection />
      <ProjectSearchFilterSection />
      <PublicProjectsPage />
      <div className="flex justify-center mt-8 mb-8">
      <Link
            href="/projects/why-projects"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Why Projects Are Important
          </Link>
      </div>
    </div>
  );
};

export default ExploreProjects;