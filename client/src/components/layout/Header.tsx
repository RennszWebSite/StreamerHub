import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-primary bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="font-gaming text-xl font-bold">R</span>
          </div>
          <h1 className="font-gaming text-xl font-bold md:text-2xl">
            RENNSZ <span className="text-primary">STREAM HUB</span>
          </h1>
        </div>

        {/* Mobile Menu Toggle */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] bg-card">
            <nav className="mt-8 flex flex-col gap-4">
              <Link href="/">
                <a
                  className="py-2 text-foreground transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
              </Link>
              <a
                href="#streams"
                className="py-2 text-foreground transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Streams
              </a>
              <a
                href="#socials"
                className="py-2 text-foreground transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Socials
              </a>
              <Link href="/admin">
                <a 
                  className="mt-2 rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-primaryDark"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </a>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/">
            <a className="font-poppins text-foreground transition-colors hover:text-primary">
              Home
            </a>
          </Link>
          <a
            href="#streams"
            className="font-poppins text-foreground transition-colors hover:text-primary"
          >
            Streams
          </a>
          <a
            href="#socials"
            className="font-poppins text-foreground transition-colors hover:text-primary"
          >
            Socials
          </a>
          <Link href="/admin">
            <a className="rounded bg-primary px-4 py-2 font-poppins text-white transition-colors hover:bg-primaryDark">
              Admin
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
