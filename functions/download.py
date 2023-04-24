import os
import subprocess
import tempfile

def handler(event, context):
    if event['httpMethod'] == 'POST':
        url = event['body'].split('=')[1]
        file_name = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False).name
        try:
            subprocess.run(["yt-dlp", "-x", "--audio-format", "mp3", "-o", file_name, url], check=True)
            with open(file_name, 'rb') as f:
                response = {
                    "statusCode": 200,
                    "headers": {
                        "Content-Disposition": f'attachment; filename="{os.path.basename(file_name)}"'
                    },
                    "body": f.read().decode('latin1')
                }
        except Exception as e:
            response = {
                "statusCode": 500,
                "body": "Error"
            }
        finally:
            os.remove(file_name)
        return response