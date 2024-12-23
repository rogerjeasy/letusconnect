"use client";

import { FaUsers } from "react-icons/fa";
import UpcomingEvents from "./UpcomingEvents";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar } from "@nextui-org/react";

// const featuredMembers = [
//   {
//     name: "Jane Doe",
//     interests: "Data Science, AI",
//     profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     name: "John Smith",
//     interests: "Entrepreneurship, Startups",
//     profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
//   },
//   {
//     name: "Emily Johnson",
//     interests: "Cloud Computing, Research",
//     profilePicture: "https://randomuser.me/api/portraits/women/55.jpg",
//   },
// ];


const groups = [
    {
      name: "AI Enthusiasts",
      members: 150,
      description: "A community for sharing insights, resources, and discussions on AI and ML.",
      icon: <FaUsers />,
      createdDate: "December 10, 2024",
      owner: {
        name: "Alice Johnson",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      },
    },
    {
      name: "Data Science Club",
      members: 200,
      description: "Discuss trends, share projects, and collaborate on data science initiatives.",
      icon: <FaUsers />,
      createdDate: "January 15, 2025",
      owner: {
        name: "Bob Smith",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    },
    {
      name: "Startup Founders",
      members: 100,
      description: "Connect with aspiring entrepreneurs and share startup experiences.",
      icon: <FaUsers />,
      createdDate: "March 10, 2025",
      owner: {
        name: "Clara White",
        avatar: "https://randomuser.me/api/portraits/women/34.jpg",
      },
    },
  ];

export default function ExploreCommunityPage() {
  return (
    <section className="bg-gray-50 py-20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Explore The Community
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          Discover peers, join interest groups, participate in events, and engage in vibrant discussions. Dive into the heart of our community!
        </p>
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search profiles, groups, or topics..."
            className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Featured Members */}
      {/* <div className="container mx-auto px-6 lg:px-20 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredMembers.map((member, index) => (
            <Card key={index} className="text-center shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <img
                  src={member.profilePicture}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">{member.name}</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">{member.interests}</p>
              </CardBody>
              <CardFooter>
                <Button color="primary" size="sm">
                  Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div> */}

      {/* Groups */}
      <div className="container mx-auto px-6 lg:px-20 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Join Interest Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groups.map((group, index) => (
            <Card
                key={index}
                className="transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
                <CardHeader className="flex justify-between items-center bg-gray-100 p-4">
                <div className="flex items-center gap-3">
                    <Avatar src={group.owner.avatar} size="sm" />
                    <div>
                    <h3 className="text-lg font-semibold">{group.owner.name}</h3>
                    <p className="text-sm text-gray-500">Owner</p>
                    </div>
                </div>
                <p className="text-sm text-gray-500">{group.createdDate}</p>
                </CardHeader>
                <CardBody className="p-6 text-center">
                <div className="flex justify-center items-center text-blue-600 text-4xl mb-4">
                    {group.icon}
                </div>
                <h3 className="text-xl font-bold">{group.name}</h3>
                <p className="text-gray-600 mt-2">{group.description}</p>
                <div className="flex items-center justify-center mt-4 gap-2">
                    <FaUsers className="text-gray-500" />
                    <span className="text-gray-600 font-semibold">{group.members} members</span>
                </div>
                </CardBody>
                <CardFooter className="flex justify-center p-4 gap-4">
                <Button color="primary" size="sm">
                    View Details
                </Button>
                <Button color="success" size="sm">
                    Join Group
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
        </div>


      {/* Upcoming Events */}
      <UpcomingEvents />
    </section>
  );
}