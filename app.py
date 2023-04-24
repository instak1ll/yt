import os
import subprocess
import uuid
from flask import Flask, request, render_template, send_file

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/download", methods=["POST"])
def download():
    url = request.form.get("url")
    if not url:
        return "Missing URL", 400
    file_name = os.path.join(os.getcwd(), f"{str(uuid.uuid4())}.mp3")
    try:
        # Descargar el archivo de audio utilizando ffmpeg
        subprocess.run(["yt-dlp", "-x", "--audio-format", "mp3", "-o", file_name, url], check=True)
        return send_file(file_name, as_attachment=True)
    except Exception as e:
        print(e)
        return "Error", 500
    finally:
        # Imprimir el mensaje de ruta del archivo descargado
        os.remove(file_name)

if __name__ == "__main__":
    app.run(debug=True)