"use client";

import Navbar from "@/components/navbar";
import { useGetUserById } from "../hooks/useUsersById";

export default function ParentPage() {
  const idParent = "cmgdv9wgx0001gqkl9qavavir";

  const { data: userData = [], isLoading, refetch } = useGetUserById(idParent);

  console.log(userData);

  return (
    <>
      <Navbar />
      <div>
        <div>Welcome, Parent From "nama anak"</div>
      </div>
    </>
  );
}
