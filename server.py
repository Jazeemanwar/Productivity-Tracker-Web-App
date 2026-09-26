import sys
import os
import re
import json
import urllib.parse
import urllib.request
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def search_youtube(query):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9"
            }
        )
        html = urllib.request.urlopen(req, timeout=6).read().decode('utf-8', errors='ignore')
        
        results = []
        data_match = re.search(r'var ytInitialData = ({.*?});</script>', html)
        if data_match:
            try:
                data = json.loads(data_match.group(1))
                contents = data['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents']
                for section in contents:
                    item_section = section.get('itemSectionRenderer', {}).get('contents', [])
                    for item in item_section:
                        vr = item.get('videoRenderer')
                        if vr:
                            vid = vr.get('videoId')
                            title = vr.get('title', {}).get('runs', [{}])[0].get('text', '')
                            channel = vr.get('ownerText', {}).get('runs', [{}])[0].get('text', '')
                            thumbs = vr.get('thumbnail', {}).get('thumbnails', [])
                            thumb = thumbs[-1].get('url', '') if thumbs else ''
                            length = vr.get('lengthText', {}).get('simpleText', 'Live/Stream')
                            if vid and title:
                                results.append({
                                    'id': vid,
                                    'title': title,
                                    'channel': channel,
                                    'thumbnail': thumb,
                                    'duration': length
                                })
            except Exception as ex:
                pass
                
        if not results:
            # Fallback regex extraction of video IDs
            vids = re.findall(r'/watch\?v=([a-zA-Z0-9_-]{11})', html)
            seen = set()
            for vid in vids:
                if vid not in seen:
                    seen.add(vid)
                    results.append({
                        'id': vid,
                        'title': f"{query} (Track {len(results)+1})",
                        'channel': 'YouTube Music',
                        'thumbnail': f"https://img.youtube.com/vi/{vid}/hqdefault.jpg",
                        'duration': 'Focus Stream'
                    })
                    if len(results) >= 8:
                        break
        return results[:8]
    except Exception as e:
        return []

class TimeLensHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/search':
            params = urllib.parse.parse_qs(parsed.query)
            q = params.get('q', [''])[0].strip()
            if not q:
                data = json.dumps({'results': []}).encode('utf-8')
            else:
                results = search_youtube(q)
                data = json.dumps({'results': results}, ensure_ascii=False).encode('utf-8')

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        # Default static file serving
        return super().do_GET()

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, TimeLensHandler)
    print(f"TimeLens Server running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run_server()
