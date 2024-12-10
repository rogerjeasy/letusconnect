"use client"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Image,
    Link,
    Tooltip,
    Avatar,
    AvatarGroup,
  } from "@nextui-org/react";

import { EventDetails } from "../../store/eventDetails";
import { extractMonthAndDay } from "../utils/dateUtils";
import { constructGoogleMapsUrl } from "../utils/locationUtils";

  interface SeeEventProps {
    isOpen: boolean;
    onClose: () => void;
    event: EventDetails
  }
  
  export default function SeeEvent({ isOpen, onClose, event }: SeeEventProps) {
    const { month, day } = extractMonthAndDay(event.date);
    const googleMapsUrl = constructGoogleMapsUrl(event);
  
    return (
      <>
        <Drawer
          hideCloseButton
          backdrop="opaque"
          classNames={{
            // base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium", // This is the default value (white background)
            base: "bg-gray-900 text-white",
            backdrop: "bg-black/50",
          }}
          isOpen={isOpen}
          onOpenChange={onClose}
        >
          <DrawerContent>
            {(onClose: () => void) => (
              <>
                <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                  <Tooltip content="Close">
                    <Button
                      isIconOnly
                      className="text-default-400"
                      size="sm"
                      variant="light"
                      onPress={onClose}
                    >
                      <svg
                        fill="none"
                        height="20"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                      </svg>
                    </Button>
                  </Tooltip>
                  <div className="w-full flex justify-start gap-2">
                    <Button
                      className="font-medium text-small text-default-500"
                      size="sm"
                      startContent={
                        <svg
                          height="16"
                          viewBox="0 0 16 16"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.85.75c-.908 0-1.702.328-2.265.933-.558.599-.835 1.41-.835 2.29V7.88c0 .801.23 1.548.697 2.129.472.587 1.15.96 1.951 1.06a.75.75 0 1 0 .185-1.489c-.435-.054-.752-.243-.967-.51-.219-.273-.366-.673-.366-1.19V3.973c0-.568.176-.993.433-1.268.25-.27.632-.455 1.167-.455h4.146c.479 0 .828.146 1.071.359.246.215.43.54.497.979a.75.75 0 0 0 1.483-.23c-.115-.739-.447-1.4-.99-1.877C9.51 1 8.796.75 7.996.75zM7.9 4.828c-.908 0-1.702.326-2.265.93-.558.6-.835 1.41-.835 2.29v3.905c0 .879.275 1.69.833 2.289.563.605 1.357.931 2.267.931h4.144c.91 0 1.705-.326 2.268-.931.558-.599.833-1.41.833-2.289V8.048c0-.879-.275-1.69-.833-2.289-.563-.605-1.357-.931-2.267-.931zm-1.6 3.22c0-.568.176-.992.432-1.266.25-.27.632-.454 1.168-.454h4.145c.54 0 .92.185 1.17.453.255.274.43.698.43 1.267v3.905c0 .569-.175.993-.43 1.267-.25.268-.631.453-1.17.453H7.898c-.54 0-.92-.185-1.17-.453-.255-.274-.43-.698-.43-1.267z"
                            fill="currentColor"
                            fillRule="evenodd"
                          />
                        </svg>
                      }
                      variant="flat"
                    >
                      Copy Link
                    </Button>
                    <Button
                      className="font-medium text-small text-default-500"
                      endContent={
                        <svg
                          fill="none"
                          height="16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                      }
                      size="sm"
                      variant="flat"
                    >
                      Event Page
                    </Button>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Tooltip content="Previous">
                      <Button isIconOnly className="text-default-500" size="sm" variant="flat">
                        <svg
                          fill="none"
                          height="16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      </Button>
                    </Tooltip>
                    <Tooltip content="Next">
                      <Button isIconOnly className="text-default-500" size="sm" variant="flat">
                        <svg
                          fill="none"
                          height="16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </Button>
                    </Tooltip>
                  </div>
                </DrawerHeader>
                <DrawerBody className="pt-16">
                  <div className="flex w-full justify-center items-center pt-4">
                    <Image
                      isBlurred
                      isZoomed
                      alt="Event image"
                      className="aspect-square w-full hover:scale-110"
                      height={300}
                      src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/places/san-francisco.png"
                    />
                  </div>
                  <div className="flex flex-col gap-2 py-4">
                    <h1 className="text-2xl font-bold leading-7">{event.title}</h1>
                    <p className="text-sm text-default-500">
                      {event.location}
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex gap-3 items-center">
                        <div className="flex-none border-1 border-default-200/50 rounded-small text-center w-11 overflow-hidden">
                          <div className="text-tiny bg-default-100 py-0.5 text-default-500">{month}</div>
                          <div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
                            {day}
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-medium text-foreground font-medium">
                            {event.date}
                          </p>
                          <p className="text-small text-default-500">{event.startTime} - {event.endTime}</p>
                        </div>
                      </div>

                      {/* Conditional Rendering for Online Event */}
                      {event.isOnline ? (
                            <div className="flex flex-col gap-1">
                            <p className="text-medium text-default-500 font-medium">This is an online event</p>
                            <Link
                                isExternal
                                showAnchorIcon
                                className="group gap-x-0.5 text-medium text-blue-500 font-medium"
                                href={event.eventLink}
                                rel="noreferrer noopener"
                            >
                                Join Event
                            </Link>
                            </div>
                        ) : (
                            <div className="flex gap-3 items-center">
                                <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                                <svg
                                    className="text-default-500"
                                    height="20"
                                    viewBox="0 0 16 16"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g
                                    fill="none"
                                    fillRule="evenodd"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    >
                                    <path d="M2 6.854C2 11.02 7.04 15 8 15s6-3.98 6-8.146C14 3.621 11.314 1 8 1S2 3.62 2 6.854" />
                                    <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                    </g>
                                </svg>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                <Link
                                    isExternal
                                    showAnchorIcon
                                    anchorIcon={
                                    <svg
                                        className="group-hover:text-inherit text-default-400 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        fill="none"
                                        height="16"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M7 17 17 7M7 7h10v10" />
                                    </svg>
                                    }
                                    className="group gap-x-0.5 text-medium text-foreground font-medium"
                                    href={googleMapsUrl}
                                    rel="noreferrer noopener"
                                >
                                    {event.specificAddress}
                                </Link>
                                <p className="text-small text-default-500">{event.city}, {event.state}, {event.country}</p>
                                </div>
                            </div>
                        )}

                      <div className="flex flex-col mt-4 gap-3 items-start">
                        <span className="text-medium font-medium">About the event</span>
                        <div className="text-medium text-default-500 flex flex-col gap-2">
                            {event.description}
                        </div>
                      </div>
                      <div className="flex flex-col mt-4 gap-3 items-start">
                        <span className="text-medium font-medium">Hosted By</span>
                        <div className="flex gap-2 items-center">
                          <Avatar
                            name="Host"
                            size="sm"
                            src={event.avatarUrl}
                          />
                          <span className="text-small text-default-500">{event.hostedBy}</span>
                        </div>
                      </div>
                      <div className="flex flex-col mt-4 gap-3 items-start">
                        <span className="text-medium font-medium">{event.attendees.length} Going</span>
                        <div className="flex gap-2 items-center">
                          <AvatarGroup
                            isBordered
                            classNames={{
                              base: "pl-2",
                              count: "text-default-500 text-tiny bg-default-100",
                            }}
                            size="sm"
                            total={event.attendees.length}
                          >
                            {event.attendees.map((attendee, index) => (
                                <Tooltip key={index} content={attendee.name}>
                                <Avatar
                                    className="data-[hover=true]:!translate-x-0"
                                    name={attendee.name}
                                    src={attendee.avatarUrl}
                                />
                                </Tooltip>
                            ))}
                          </AvatarGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerBody>
                <DrawerFooter className="flex flex-col gap-2">
                    <Tooltip content={event.hostEmail}>
                        <Link className="text-default-400" href={`mailto:${event.hostEmail}`} size="sm">
                        <span className="text-white font-bold">Contact Host</span>
                        </Link>
                    </Tooltip>
                    <Tooltip content={event.appEmail}>
                        <Link className="text-default-400" href={`mailto:${event.appEmail}`} size="sm">
                        <span className="text-white font-bold">Report Event</span>
                        </Link>
                    </Tooltip>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </>
    );
  }  