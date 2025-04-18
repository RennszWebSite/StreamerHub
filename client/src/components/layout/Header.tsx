import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-primary/20 glass-card backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="overflow-hidden rounded-full border-2 border-primary/30 ring-2 ring-primary/10 ring-offset-2 ring-offset-black/40">
            <img 
              src="/assets/rennsz_profile.png" 
              alt="Rennsz" 
              className="h-12 w-12 object-cover object-center"
            />
          </div>
          <h1 className="font-gaming text-xl font-bold md:text-2xl tracking-wide">
            <span className="premium-gradient-text">RENNSZ</span> <span className="text-white/90">STREAM HUB</span>
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
                  className="premium-button mt-2 rounded-md border border-primary/20 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:brightness-110"
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
            <a className="premium-button rounded-md border border-primary/20 px-5 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:brightness-110">
              Admin
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
