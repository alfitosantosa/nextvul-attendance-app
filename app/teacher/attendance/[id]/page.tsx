"use client";

import { useGetClasses } from "@/app/hooks/useClass";
import { useGetScheduleById } from "@/app/hooks/useGetScheduleById";
import Navbar from "@/components/navbar";
import { useParams } from "next/navigation";

export default function Page() {
  //fetch schedule by id schedule and fetch class for request student list for attendance from selected class, and validation if done attendance today

  const params = useParams();
  console.log(params);

  const { data: scheduleData, isLoading, isError } = useGetScheduleById(params.id as string);

  const {data : classData, isLoading: isLoadingClass, isError: isErrorClass} = useGetClasses();

  return (
    <>
      <Navbar />
      <div>Attendance Page for Teacher Today by schedule selected</div>
    </>
  );
}
