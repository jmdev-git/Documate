"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EllipsisVerticalIcon,
  LayoutGrid,
  Menu,
  SquarePen,
  StepBack,
  StepForward,
  UserSearch,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDirection } from "@radix-ui/react-direction";
import Link from "next/link";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";

const AppSidebar = ({ expanded, setExpanded, mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const direction = useDirection();
  const { researchId } = useParams();
  const [promptHistory, setPromptHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchAiResponse = async () => {
      try {
        if (!session?.user.id) return;

        const res = await fetch(`/api/openai/${session?.user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();
        if (res.ok) setPromptHistory(result.responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAiResponse();
  }, [session]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setPromptHistory((prev) => prev.filter((item) => item._id !== id));
        setOpen(false);
        toast.success("Deleted successfully.", { autoClose: 5000 });
      } else {
        toast.error("Please try again!.", { autoClose: 5000 });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleMobileClose = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  if (status === "loading") {
    return (
      <aside
        className={`bg-white dark:bg-black border-r hidden dark:border-r-gray-200/30 w-64 h-full fixed top-0 left-0 p-4 md:flex flex-col justify-between md:z-50 z-0`}
      >
        <div className="flex flex-col space-y-6">
          <Skeleton className="h-4 w-28 rounded mt-14" />
          <div className="flex flex-col space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-4 rounded" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1 w-full">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-3 w-full rounded" />
          </div>
        </div>
      </aside>
    );
  }

  if (!session || !session.user) return <p>No user logged in</p>;
  const { user } = session;

  const link = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutGrid size={20} /> },
    {
      name: "New Document",
      href: "/dashboard/create-document",
      icon: <SquarePen size={20} />,
    },
    {
      name: "Research",
      href: `/dashboard/r/${researchId}`,
      icon: <UserSearch size={20} />,
    },
  ];

  if (!mounted) return null;

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-black border-r dark:border-r-gray-200/30 transition-all duration-300 ease-in-out z-40
    ${expanded ? "md:w-64" : "md:w-20"}
    ${mobileOpen ? "w-64 translate-x-0 shadow-xl" : "-translate-x-full"}
    md:translate-x-0
  `}
    >
      <nav className="flex flex-col p-4 h-full relative">
        <div
          className={`absolute cursor-pointer md:block hidden transition-transform duration-200 hover:scale-110  ${
            expanded ? "top-15 -right-2" : "top-16 left-6"
          }`}
          onClick={() => setExpanded((curr) => !curr)}
        >
          <div className="p-1.5 dark:bg-black border bg-white text-primary dark:border-gray-200/30 dark:text-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
            {expanded ? <StepBack size={18} /> : <StepForward size={18} />}
          </div>
        </div>

        <ul className={`flex-1 ${expanded ? "mt-12" : "mt-16"}`}>
          <span
            className={`text-xs text-muted-foreground dark:text-white overflow-hidden transition-all duration-300 
            ${expanded ? "opacity-100" : "opacity-0"}`}
          >
            Components
          </span>

          {link.map((l, i) => (
            <a key={i} href={l.href} onClick={handleMobileClose}>
              <li
                className={`flex items-center my-3 px-4 py-2.5 rounded-sm overflow-hidden transition-all duration-300 ease-in-out 
                ${
                  pathname === l.href
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-secondary text-muted-foreground dark:text-white hover:translate-x-1"
                }
                ${expanded ? "" : "justify-center"}`}
              >
                <span className="transition-transform duration-300">
                  {l.icon}
                </span>
                <span
                  className={`ml-3 text-sm overflow-hidden transition-all duration-300 ${
                    expanded ? "opacity-100" : "opacity-0 hidden"
                  }`}
                >
                  {l.name}
                </span>
              </li>
            </a>
          ))}

          <div className="mt-4">
            <span
              className={`text-xs text-muted-foreground dark:text-white  ${
                expanded ? "text-left" : "text-center ml-1"
              }`}
            >
              History
            </span>
            {promptHistory.length === 0 ? (
              <div className="relative py-4">
                <span className="block text-center text-sm font-medium text-muted-foreground">
                  No History
                </span>
              </div>
            ) : (
              <ul className="group mt-2 space-y-2">
                {promptHistory.slice(0, 4).map((h) => (
                  <li
                    key={h._id}
                    className={`flex items-center px-4 py-2 text-sm rounded-sm cursor-pointer dark:text-white text-muted-foreground 
                    transition-all duration-300 ease-in-out
                    ${
                      pathname === `/dashboard/h/${h._id}`
                        ? "bg-primary text-white shadow-md"
                        : "hover:bg-secondary dark:hover:bg-gray-200/10 hover:translate-x-1"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <Link
                        href={`/dashboard/h/${h._id}`}
                        onClick={handleMobileClose}
                      >
                        <span
                          className={`overflow-hidden transition-all duration-200 ${
                            expanded ? "line-clamp-1" : "hidden"
                          }`}
                        >
                          {h.user_text}
                        </span>
                      </Link>
                      <AlertDialog
                        open={open === h._id}
                        onOpenChange={(open) => setOpen(open ? h._id : null)}
                      >
                        <AlertDialogTrigger asChild>
                          <span
                            className={`transition-opacity duration-200 cursor-pointer  ${
                              expanded
                                ? "md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
                                : "opacity-100"
                            }`}
                          >
                            <EllipsisVerticalIcon size={16} />
                          </span>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir={direction}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm Your Action
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Once confirmed, this action cannot be undone. It
                              will permanently delete your document history and
                              remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => handleDelete(e, h._id)}
                              variant="destructive"
                              className="cursor-pointer flex items-center gap-1"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <Spinner />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ul>

        <div
          className={`rounded-sm flex items-center transition-all duration-300 ease-in-out hover:bg-secondary/70
    ${
      expanded
        ? "justify-start px-3 py-2 gap-2 bg-secondary dark:bg-gray-200/10"
        : "justify-center p-2 bg-transparent"
    }
  `}
        >
          <img
            src={user?.image}
            alt={user.name}
            className={`rounded-full hover:scale-105 transition-all duration-300
      ${expanded ? "size-9" : "size-10"}
    `}
          />
          <div
            className={`flex flex-col leading-4 overflow-hidden whitespace-nowrap text-sm transition-all duration-300
      ${
        expanded
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-2 hidden"
      }
    `}
          >
            <span title={user?.name} className="font-medium line-clamp-1">
              {user?.name}
            </span>
            <span
              title={user?.email}
              className="text-xs text-muted-foreground line-clamp-1"
            >
              {user?.email}
            </span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AppSidebar;
