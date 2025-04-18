export default function Footer() {
  return (
    <footer className="border-t border-primary border-opacity-30 bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="font-gaming text-sm font-bold">R</span>
            </div>
            <span className="font-gaming text-lg">RENNSZ</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="mb-1 text-sm text-muted-foreground">Made with ♥️ by sf.xen on discord</p>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Rennsz Stream Hub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
