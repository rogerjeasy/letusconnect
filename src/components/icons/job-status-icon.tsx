import {
    PlusCircle,
    UserCheck,
    BadgeCheck,
    XCircle,
    MinusCircle,
    CheckCircle2,
    Archive,
    Hourglass,
  } from "lucide-react";
  
  export const JobStatusIcons = {
    APPLIED: (props: { className?: string }) => (
      <PlusCircle {...props} className={`text-blue-500 ${props.className || ""}`} />
    ),
    INTERVIEWING: (props: { className?: string }) => (
      <UserCheck {...props} className={`text-yellow-500 ${props.className || ""}`} />
    ),
    OFFERED: (props: { className?: string }) => (
      <BadgeCheck {...props} className={`text-green-600 ${props.className || ""}`} />
    ),
    REJECTED: (props: { className?: string }) => (
      <XCircle {...props} className={`text-red-500 ${props.className || ""}`} />
    ),
    WITHDRAWN: (props: { className?: string }) => (
      <MinusCircle {...props} className={`text-gray-500 ${props.className || ""}`} />
    ),
    HIRED: (props: { className?: string }) => (
      <CheckCircle2 {...props} className={`text-emerald-600 ${props.className || ""}`} />
    ),
    ARCHIVED: (props: { className?: string }) => (
      <Archive {...props} className={`text-purple-500 ${props.className || ""}`} />
    ),
    IN_REVIEW: (props: { className?: string }) => (
      <Hourglass {...props} className={`text-orange-500 ${props.className || ""}`} />
    ),
  };
  