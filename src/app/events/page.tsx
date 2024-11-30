import Link from "next/link";
import React from "react";

export default function EventsPage() {
  return (
    <div>
      <h3 className="text-3xl">
        Events Page
      </h3>
      <Link href="/">Go Back Home</Link>
    </div>
  );
}