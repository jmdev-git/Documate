"use client";
import React, { useEffect, useState } from "react";
import DocumentWebViewer from "./_components/DocumentWebViewer";
import { useParams } from "next/navigation";

const Document = () => {
  const { documentId } = useParams();
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchDcoument = async () => {
      try {
        const res = await fetch(`/api/document/${documentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok) {
          setContent(data.document);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDcoument();
  }, []);

  return (
    <section>
      <div className="mt-10.5">
        <DocumentWebViewer content={content} />
      </div>
    </section>
  );
};

export default Document;
