import React from "react";
import LoginForm from "./_components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const Authentication = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <>
      <LoginForm />
    </>
  );
};

export default Authentication;
