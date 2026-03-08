import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconTopologyRing3,
} from "@tabler/icons-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-2 flex items-center gap-2">
            <IconTopologyRing3 className="size-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              AMAROS<span className="text-muted-foreground font-normal"> Registry</span>
            </span>
          </Link>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>
            Sign in to publish and manage your nodes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <Button variant="outline" className="w-full" type="submit">
              <IconBrandGithub className="size-4" />
              Continue with GitHub
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button variant="outline" className="w-full" type="submit">
              <IconBrandGoogle className="size-4" />
              Continue with Google
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to the AMAROS terms of service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
