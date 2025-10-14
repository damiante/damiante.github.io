import { Github, Linkedin, Mail, Rss } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-medium mb-2">Echoes from Damian's mind</p>
            <p className="text-sm opacity-80">
              Projects and thoughts by just another guy
            </p>
          </div>
          
          <div className="flex gap-6">
            <a
              href="https://github.com/damiante"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="mailto:damian@damiantesta.com"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="RSS Feed"
            >
              <Rss className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} Damian Testa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
