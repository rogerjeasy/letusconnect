"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "@nextui-org/react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import SectionTitle from "../../shared/SectionTitle";
import SingleDropdownSelection from "../../forms/SingleSelection";
import TextareaForm from "../../forms/TextArea";
import { FaSearch } from "react-icons/fa";

// Time options
const timeOptions = [
  { key: "08:00", label: "08:00 AM" },
  { key: "09:00", label: "09:00 AM" },
  { key: "10:00", label: "10:00 AM" },
  { key: "11:00", label: "11:00 AM" },
  { key: "12:00", label: "12:00 PM" },
  { key: "13:00", label: "01:00 PM" },
  { key: "14:00", label: "02:00 PM" },
  { key: "15:00", label: "03:00 PM" },
  { key: "16:00", label: "04:00 PM" },
  { key: "17:00", label: "05:00 PM" },
];

// Meeting method options
const meetingMethods = [
  { key: "zoom", label: "Zoom" },
  { key: "google-meet", label: "Google Meet" },
  { key: "in-person", label: "In-Person" },
];

export default function ScheduleSession() {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingMethod, setMeetingMethod] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (date && startTime && endTime && meetingMethod) {
      alert(`Session scheduled for ${date.toDateString()} from ${startTime} to ${endTime} via ${meetingMethod}. Location: ${location}. Notes: ${notes}`);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="🗓️ Schedule a Session" />

        <Card className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
          <CardHeader className="flex flex-col items-center gap-2 mb-6">
            <FaSearch size={40} className="text-teal-500" />
            <h3 className="text-2xl font-bold text-center text-teal-600">
              Set Up Virtual or In-Person Mentorship Sessions
            </h3>
          </CardHeader>

          <CardBody className="space-y-8">
            {/* Calendar to Select Date */}
            <div className="flex justify-center">
              <div>
                <h4 className="font-medium mb-2 text-center">Select Date</h4>
                <Calendar onChange={(value) => setDate(value as Date)} value={date} />
              </div>
            </div>

            {/* Time Picker to Select Start and End Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SingleDropdownSelection
                label="Start Time"
                placeholder="Select Start Time"
                options={timeOptions}
                onChange={setStartTime}
              />
              <SingleDropdownSelection
                label="End Time"
                placeholder="Select End Time"
                options={timeOptions}
                onChange={setEndTime}
              />
            </div>

            {/* Meeting Method */}
            <SingleDropdownSelection
              label="Meeting Method"
              placeholder="Select Meeting Method"
              options={meetingMethods}
              onChange={setMeetingMethod}
            />

            {/* Location */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Location</label>
              <Input
                type="text"
                placeholder="Enter Location (if applicable)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Additional Notes */}
            <TextareaForm
              label="Additional Notes"
              placeholder="Add any notes or details for the session..."
              description="Optional: Add extra information for the mentor/mentee."
              value={notes}
              onChange={setNotes}
            />

            {/* Submit Button */}
            <div className="text-center">
              <Button color="primary" size="lg" radius="lg" className="font-bold" onClick={handleSubmit}>
                Send Session Request
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}