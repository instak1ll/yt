const downloadForm = document.getElementById("download-form");

downloadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const url = formData.get("url");

  try {
    const response = await fetch("/download", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "audio.mp3";
      link.click();
      URL.revokeObjectURL(url);
      event.target.reset();
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
    alert("Error al descargar el archivo");
  }
});
