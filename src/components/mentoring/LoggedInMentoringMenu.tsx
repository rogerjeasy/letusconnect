"use client";

import FindMentorMentee from "./authmentorship/FindMentorMentee";
import ScheduleSession from "./authmentorship/ScheduleSession";



export default function LoggedInMentoringMenu() {
    return (
        <div>
            <FindMentorMentee />
            <ScheduleSession />
        </div>
    );
}