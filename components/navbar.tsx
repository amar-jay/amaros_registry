import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconTopologyRing3,
  IconBrandGithub,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";

export async function Navbar({ children }: { children?: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <IconTopologyRing3 className="size-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">
            AMAROS
            <span className="text-muted-foreground font-normal">
              {" "}
              Registry
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/explore"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/publish"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Publish
          </Link>
          <Link
            href="/#concepts"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Concepts
          </Link>
          <Link
            href="/#install"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Get Started
          </Link>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub className="size-4" />
              GitHub
            </a>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer rounded-full outline-none ring-ring focus-visible:ring-2">
                  <Avatar className="size-8">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full cursor-pointer">
                      <IconLogout className="size-4" />
                      Sign out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/auth/signin">
                <IconLogin className="size-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
      {children}
    </nav>
  );
}
