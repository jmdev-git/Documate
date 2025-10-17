"use client";
import { Button } from "@/components/ui/button";
import { login_fields } from "@/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSession, signIn } from "next-auth/react";
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
import { Magnetic } from "@/components/motion-primitives/magnetic";

const LoginForm = () => {
  const [form, setForm] = useState({
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

    if (!form.email || !form.password) {
      toast.warning("All fields are necessary.");
      return;
    }

    const loadingToast = toast.loading("Logging in to your account...");

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res.ok) {
        toast.update(loadingToast, {
          render: "Login successfully.",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        e.target.reset();
        const session = await getSession();
        if (session?.user.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      } else {
        toast.update(loadingToast, {
          render: "Invalid credentials.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        e.target.reset();
        return;
      }
    } catch (error) {
      console.log("An error occured: ", error);
      toast.update(loadingToast, {
        render: data.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
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
                  <div className="flex items-start gap-0.5">
                    <img
                      src="/DarkModeLogo.png"
                      className="md:h-9 md:w-8 w-8 h-10"
                      alt="Image Logo"
                    />
                    <div className="md:-space-y-2 -space-y-1.5 md:-mt-0.5 dark:text-white">
                      <h4 className="md:text-lg text-base">Documate</h4>
                      <p className="text-xs">by JMDev</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-0.5">
                    <img
                      src="/LightModeLogo.png"
                      className="md:h-9 md:w-8 w-8 h-10"
                      alt="Image Logo"
                    />
                    <div className="md:-space-y-2 -space-y-1.5 md:-mt-0.5 text-primary">
                      <h4 className="text-lg">Documate</h4>
                      <p className="text-xs">by JMDev</p>
                    </div>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-2">
                  {login_fields.map((f, i) => (
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
              <Magnetic>
                <Button className={"cursor-pointer text-white w-full"} type="submit">
                  Login
                </Button>
              </Magnetic>
              <span className="text-center mt-2.5 text-sm text-muted-foreground">
                Don't have an account yet?{" "}
                <Link
                  href={"/register"}
                  className="font-semibold text-primary hover:underline transition duration-200"
                >
                  Register
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

export default LoginForm;
