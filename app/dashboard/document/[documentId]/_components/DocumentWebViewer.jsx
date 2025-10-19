"use client";
import { Spinner } from "@/components/ui/spinner";
import { Editor } from "@tinymce/tinymce-react";
import { marked } from "marked";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export default function DocumentWebViewer({ content }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const iso = content?.createdAt;
  const date = new Date(iso);

  const formatted = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const convertedMarkdown = marked(content?.content || "");

  const initialHTML = `
  <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #000;">
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
      <strong>Year & Program & Block:</strong> _________________________
    </p>

    <p style="margin: 6px 0 20px 0;">
      <strong>Subject & Code:</strong> ___________________________
    </p>

     <p style="margin: 6px 0 20px 0;">
      <strong>Assignment No.</strong> ___________________________
    </p>

    <div style="margin-top: 10px;">
      ${convertedMarkdown}
    </div>
  </div>
`;

  if (!mounted || !content) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Spinner className="text-primary size-8" />
      </div>
    );
  }

  return (
    <div>
      <Editor
        key={theme}
        apiKey={process.env.TINYMCE_API_KEY}
        init={{
          height: 610,
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
          `,
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (request, respondWith) =>
            respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant")
            ),
          uploadcare_public_key: process.env.UPLOADCARE_KEY,
        }}
        initialValue={initialHTML}
      />
    </div>
  );
}
