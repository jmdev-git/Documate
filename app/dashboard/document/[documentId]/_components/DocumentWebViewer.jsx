"use client";
import { Spinner } from "@/components/ui/spinner";
import { Editor } from "@tinymce/tinymce-react";
import { marked } from "marked";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import htmlDocx from "html-docx-js/dist/html-docx";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DocumentWebViewer({ content }) {
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { theme } = useTheme();
  const editorRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (content) {
      const timer = setTimeout(() => setIsReady(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [content]);

  const iso = content?.createdAt;
  const date = new Date(iso);

  const formatted = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const convertedMarkdown = marked(content?.content || "");

  const initialHTML = `
  <div style="
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #000;
  ">
    <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 10px;">
      <tr>
        <td style="text-align: left; border: none; padding: 4px 0;">
          <strong>Name:</strong> ___________________________
        </td>
        <td style="text-align: right; border: none; padding: 4px 0;">
          <strong>Date:</strong> ${formatted}
        </td>
      </tr>
    </table>

    <p style="margin: 6px 0;">
      <strong>Year & Program & Block:</strong> ___________________________
    </p>

    <p style="margin: 6px 0;">
      <strong>Subject & Code:</strong> ___________________________
    </p>

    <p style="margin: 6px 0 20px 0;">
      <strong>Assignment No.</strong> ___________________________
    </p>

    <div style="margin-top: 10px; padding-bottom: 3rem;">
      ${convertedMarkdown}
    </div>
  </div>
`;

  const handleExportDOCX = () => {
    if (!editorRef.current) return alert("Editor not ready yet!");
    const html = editorRef.current.getContent();
    const converted = htmlDocx.asBlob(html);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = "document.docx";
    link.click();
  };

  const handleExportPDF = async () => {
    const iframe = document.querySelector(".tox-edit-area iframe");
    const element = iframe?.contentDocument?.body;
    if (!element) return alert("Editor not ready!");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#fff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("document.pdf");
  };

  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-45px)]">
        <Spinner className="text-primary size-8" />
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="h-[calc(100vh-45px)] relative">
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[50]">
        <div className="md:hidden flex items-center gap-1.5">
          <Button
            size="sm"
            className={"text-white cursor-pointer"}
            onClick={handleExportDOCX}
          >
            Export to Docx
          </Button>
          <Button
            size="sm"
            className={"text-white cursor-pointer"}
            onClick={handleExportPDF}
          >
            Export to PDF
          </Button>
        </div>
      </div>
      <Editor
        key={theme}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: "100%",
          resize: false,
          skin: theme === "dark" ? "oxide-dark" : "oxide",
          content_css: theme === "dark" ? "dark" : "default",
          statusbar: false,
          branding: false,
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "advtemplate",
            "ai",
            "uploadcare",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          content_style: `
            body {
              background-color: #ffffff !important;
              color: #000000 !important;
            }
            p, h1, h2, h3, h4, h5, h6, td, th, li {
              color: #000000 !important;
            }
            code, pre {
              background: none !important;
              color: #000000 !important;
              border: none !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            pre {
              background-color: transparent !important;
            }`,
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (request, respondWith) =>
            respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant")
            ),
          uploadcare_public_key: process.env.UPLOADCARE_PUBLIC_KEY,
        }}
        initialValue={initialHTML}
      />
    </div>
  );
}
