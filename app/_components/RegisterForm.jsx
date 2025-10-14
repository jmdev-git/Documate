"use client";
import { Button } from "@/components/ui/button";
import { register_fields } from "@/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { useTheme } from "next-themes";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const onChangeValue = (e) => {
    setForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.warning("All fields are necessary.");
      return;
    }

    const loadingToast = toast.loading("Registering your account...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.update(loadingToast, {
          render: "Registration successfully.",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        e.target.reset();
        router.push("/");
      } else if (res.status === 409) {
        toast.update(loadingToast, {
          render: "User already exist.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        e.target.reset();
        return;
      } else {
        toast.update(loadingToast, {
          render: "Something went wrong.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        e.target.reset();
      }
    } catch (error) {
      console.log("An error occured: ", error);
    }
  };

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-auto w-full">
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <Card className="relative md:w-[480px] w-full overflow-hidden">
            <CardHeader>
              <CardTitle>
                {theme === "dark" ? (
                  <div className="flex items-center gap-1">
                    <img
                      src="/DarkModeLogo.png"
                      className="md:size-10 w-8 h-10"
                      alt="Image Logo"
                    />
                    <div className="-space-y-1.5">
                      <h4 className="md:text-lg text-base">Documate</h4>
                      <p className="text-xs">by JMDev</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <img
                      src="/LightModeLogo.png"
                      className="md:size-10 w-8 h-10"
                      alt="Image Logo"
                    />
                    <div className="-space-y-1.5">
                      <h4 className="text-lg">Documate</h4>
                      <p className="text-xs">by JMDev</p>
                    </div>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Create your account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-2">
                  {register_fields.map((f, i) => (
                    <div key={i} className="grid w-full items-center gap-2">
                      <Label htmlFor={f.name}>{f.label}</Label>
                      <Input
                        className={"rounded-sm border bg-[#fafafa]"}
                        type={f.type}
                        name={f.name}
                        id={f.name}
                        placeholder={f.placeholder}
                        onChange={onChangeValue}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="grid">
              <Button className={"cursor-pointer text-white"} type="submit">
                Register
              </Button>
              <span className="text-center mt-2.5 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={"/"}
                  className="font-semibold text-primary hover:underline transition duration-200"
                >
                  Login
                </Link>
              </span>
            </CardFooter>
            <BorderBeam duration={8} size={300} />
          </Card>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
