#!/usr/bin/env python
import http.server, socketserver, sys, threading

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

socketserver.TCPServer.allow_reuse_address = True

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving on port {PORT}")
        httpd.serve_forever()
