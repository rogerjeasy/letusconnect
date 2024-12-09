"use client"


import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import Link from "next/link";
import ImageZoom from "../forms/ImageZoom";


export default function MentorProfileCard({ name, role, image, detailsLink }: { name: string; role: string; image: string; detailsLink: string }) {
    return (
      <Card className="w-80 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        <CardHeader className="flex flex-col items-center">
          <ImageZoom src={image} alt={name} width={150} height={150} className="rounded-full mb-4" />
          <h3 className="text-lg font-bold">{name}</h3>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-gray-500 mb-4">{role}</p>
          <Link href={detailsLink}>
            <Button color="primary" size="md" className="font-bold">
              View Details
            </Button>
          </Link>
        </CardBody>
      </Card>
    );
  }