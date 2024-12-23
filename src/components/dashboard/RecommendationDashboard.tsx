"use client";

import { Card, CardHeader, CardBody, CardFooter, Button, Avatar } from "@nextui-org/react";
import { FaUsers, FaProjectDiagram, FaCalendarAlt } from "react-icons/fa";

interface ConnectionItem {
  name: string;
  description: string;
  joinedDate: string;
  profilePicture: string;
  connectionsCount: number;
}

interface ProjectItem {
  name: string;
  description: string;
  creationDate: string;
}

interface EventItem {
  name: string;
  description: string;
  eventDate: string;
}

type RecommendationItem = ConnectionItem | ProjectItem | EventItem;

interface Recommendation {
  type: "Connections" | "Projects" | "Events";
  title: string;
  items: RecommendationItem[];
  icon: JSX.Element;
}

const recommendations: Recommendation[] = [
  {
    type: "Connections",
    title: "People You May Know",
    items: [
      {
        name: "Alice Johnson",
        description: "Data Scientist at TechCorp",
        joinedDate: "2023-01-10",
        profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
        connectionsCount: 150,
      },
      {
        name: "Mark Smith",
        description: "AI Researcher at InnovateLab",
        joinedDate: "2023-03-15",
        profilePicture: "https://randomuser.me/api/portraits/men/34.jpg",
        connectionsCount: 200,
      },
      {
        name: "Sophia Lee",
        description: "Product Manager at StartupHub",
        joinedDate: "2023-05-20",
        profilePicture: "https://randomuser.me/api/portraits/women/68.jpg",
        connectionsCount: 180,
      },
    ],
    icon: <FaUsers className="text-blue-600 text-3xl" />,
  },
  {
    type: "Projects",
    title: "Recommended Projects",
    items: [
      {
        name: "AI for Social Good",
        description: "Build models to address societal challenges.",
        creationDate: "2024-06-01",
      },
      {
        name: "Blockchain Research",
        description: "Exploring decentralized finance.",
        creationDate: "2024-07-10",
      },
      {
        name: "HealthTech Innovations",
        description: "Improving healthcare with technology.",
        creationDate: "2024-08-05",
      },
    ],
    icon: <FaProjectDiagram className="text-green-600 text-3xl" />,
  },
  {
    type: "Events",
    title: "Upcoming Events",
    items: [
      {
        name: "Data Science Workshop",
        description: "Learn the latest trends in Data Science.",
        eventDate: "2024-10-15",
      },
      {
        name: "Startup Pitch Night",
        description: "Network with investors and startups.",
        eventDate: "2024-11-05",
      },
      {
        name: "AI Ethics Webinar",
        description: "Discuss the ethical implications of AI.",
        eventDate: "2024-12-01",
      },
    ],
    icon: <FaCalendarAlt className="text-purple-600 text-3xl" />,
  },
];

export default function RecommendationDashboard() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Recommendations for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <Card key={index} isHoverable className="transition-transform hover:scale-105 shadow-lg">
              <CardHeader className="flex items-center gap-4">
                {recommendation.icon}
                <h3 className="text-lg font-bold text-gray-800">{recommendation.title}</h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-4">
                  {recommendation.items.map((item, idx) => (
                    <Card key={idx} isHoverable className="shadow-lg">
                      {/* Card Header with Profile Picture for Connections */}
                      {recommendation.type === "Connections" && (
                        <CardHeader className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar src={(item as ConnectionItem).profilePicture} size="lg" />
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                {(item as ConnectionItem).connectionsCount} connections
                              </p>
                            </div>
                          </div>
                          {/* <p className="text-sm text-gray-600">
                            Joined: {(item as ConnectionItem).joinedDate}
                          </p> */}
                        </CardHeader>
                      )}

                      {/* Default Card Header for Projects and Events */}
                      {recommendation.type !== "Connections" && (
                        <CardHeader
                          className={`py-4 text-lg font-bold rounded-t-md ${{
                            Projects: "bg-green-100 text-green-800",
                            Events: "bg-purple-100 text-purple-800",
                          }[recommendation.type]}`}
                        >
                          {item.name}
                        </CardHeader>
                      )}

                      {/* Card Body */}
                      <CardBody className="text-gray-600 px-4 py-6">
                        {item.description}
                      </CardBody>

                      {/* Card Footer with Buttons and Date */}
                      <CardFooter className="flex items-center justify-between py-3 px-4">
                        {recommendation.type === "Connections" && (
                          <Button size="sm" className="bg-blue-600 text-white font-bold hover:bg-blue-700">
                            Connect
                          </Button>
                        )}
                        {recommendation.type === "Projects" && (
                          <Button size="sm" className="bg-green-600 text-white font-bold hover:bg-green-700">
                            View Details
                          </Button>
                        )}
                        {recommendation.type === "Events" && (
                          <Button size="sm" className="bg-purple-600 text-white font-bold hover:bg-purple-700">
                            View Details
                          </Button>
                        )}
                        <p className="text-sm text-gray-600">
                          {recommendation.type === "Connections" && "Joined on: " + (item as ConnectionItem).joinedDate}
                          {recommendation.type === "Projects" && "Created on: " + (item as ProjectItem).creationDate}
                          {recommendation.type === "Events" && "Event on: " + (item as EventItem).eventDate}
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </ul>
              </CardBody>
              <div className="p-4 flex justify-center">
                <Button className="bg-blue-600 text-white font-bold hover:bg-blue-700" size="sm">
                  View All
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}