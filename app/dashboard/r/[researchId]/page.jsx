"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Research from "./_components/Research";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const ResearchOverview = () => {
  const { researchId } = useParams();
  const [preference, setPreference] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const session = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        const res = await fetch(`/api/parameters/${researchId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok) {
          setPreference([data.parameters]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchParameter();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput) {
      toast.warning("Oops! Empty field.");
      setLoading(false);
      return;
    }

    setResponse("");
    setLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          preference,
          email: session?.data?.user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.generatedText);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <Research
          preference={preference}
          userInput={userInput}
          setUserInput={setUserInput}
          response={response}
          onGenerate={handleSubmit}
          loading={loading}
        />
      </form>
    </section>
  );
};

export default ResearchOverview;
