"use client"

import Timetable from "./components/TimeTable/Timetable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>학교 시간표</h1>
      <Timetable />
    </main>
  );
}