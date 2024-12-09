"use client";

import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import Link from "next/link";
import { FaBookOpen } from "react-icons/fa";

export default function ResourcePreviews() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center justify-center gap-2">
        <FaBookOpen /> Resource Previews
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        <Card className="w-80 p-4 rounded-lg shadow-md">
          <CardHeader className="font-bold text-lg">5 Tips for Effective Networking</CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Learn how to build meaningful connections at virtual events.</p>
            <Link href="/resources">
              <Button color="secondary" radius="lg" className="w-full">
                Read More
              </Button>
            </Link>
          </CardBody>
        </Card>
        <Card className="w-80 p-4 rounded-lg shadow-md">
          <CardHeader className="font-bold text-lg">Finding the Perfect Mentor</CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">Discover how to identify and approach potential mentors.</p>
            <Link href="/resources">
              <Button color="secondary" radius="lg" className="w-full">
                Read More
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}