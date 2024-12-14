"use client";

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Card, CardFooter, Pagination } from "@nextui-org/react";

const projects = [
  {
    id: "1",
    title: "AI-Powered Chatbot for Education",
    description:
      "This AI-powered chatbot is designed to assist students by providing real-time answers to their questions. It can handle queries related to various subjects, recommend additional resources, and offer personalized learning support. The chatbot uses natural language processing to understand context and deliver accurate responses.",
    owner: {
      name: "John Doe",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    skillsNeeded: ["Python", "NLP"],
    collaborationType: "Public",
    industry: "Education",
    status: "Open",
  },
  {
    id: "2",
    title: "Financial Forecasting Tool",
    description:
      "This financial forecasting tool leverages machine learning algorithms to provide accurate financial predictions. It helps businesses anticipate market trends, manage investments, and optimize budgets.",
    owner: {
      name: "Jane Smith",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    skillsNeeded: ["TensorFlow", "Python"],
    collaborationType: "Private",
    industry: "Finance",
    status: "In Progress",
  },
  {
    id: "3",
    title: "Smart Home IoT Platform",
    description:
      "This IoT platform provides a centralized solution for managing smart home devices. Users can control lighting, security systems, and climate settings from a single interface.",
    owner: {
      name: "Alice Johnson",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    skillsNeeded: ["IoT", "Node.js"],
    collaborationType: "Public",
    industry: "Technology",
    status: "Completed",
  },
  {
    id: "4",
    title: "Healthcare AI Assistant",
    description:
      "This AI-powered healthcare assistant helps doctors with diagnoses and treatment recommendations. The assistant analyzes patient data and medical histories to provide accurate diagnostic suggestions.",
    owner: {
      name: "Bob Brown",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
    },
    skillsNeeded: ["Python", "AI"],
    collaborationType: "Private",
    industry: "Healthcare",
    status: "Open",
  },
  {
    id: "5",
    title: "E-commerce Recommendation System",
    description:
      "An AI-driven recommendation system that suggests products based on user behavior and purchase history. Enhances the shopping experience with personalized recommendations.",
    owner: {
      name: "Emma Wilson",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
    skillsNeeded: ["Python", "Machine Learning"],
    collaborationType: "Public",
    industry: "Retail",
    status: "Open",
  },
  {
    id: "6",
    title: "Blockchain Voting System",
    description:
      "A secure blockchain-based voting system to ensure transparency and prevent voter fraud. Designed for elections and polls with decentralized verification.",
    owner: {
      name: "Michael Lee",
      avatarUrl: "https://i.pravatar.cc/150?img=6",
    },
    skillsNeeded: ["Blockchain", "Solidity"],
    collaborationType: "Private",
    industry: "Government",
    status: "In Progress",
  },
  {
    id: "7",
    title: "Virtual Reality Learning Platform",
    description:
      "A VR-based platform that provides immersive learning experiences for students. Covers subjects like science, history, and art in a virtual environment.",
    owner: {
      name: "Sophia Martinez",
      avatarUrl: "https://i.pravatar.cc/150?img=7",
    },
    skillsNeeded: ["Unity", "VR"],
    collaborationType: "Public",
    industry: "Education",
    status: "Completed",
  },
];

const ITEMS_PER_PAGE = 3;

const ProjectListingsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the current projects to display based on the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">🎯 Project Listings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 mb-6">
        {currentProjects.map((project) => (
          <div key={project.id} className="flex justify-center">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <Card className="p-4 shadow-lg max-w-md mx-auto">
        <CardFooter className="flex justify-center">
          <Pagination
            total={Math.ceil(projects.length / ITEMS_PER_PAGE)}
            initialPage={1}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
            showControls
            color="primary"
          />
        </CardFooter>
      </Card>
    </section>
  );
};

export default ProjectListingsSection;