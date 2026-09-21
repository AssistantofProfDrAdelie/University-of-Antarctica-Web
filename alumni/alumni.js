(() => {
  const gallery = document.querySelector("#travel-gallery");
  const loadError = document.querySelector("#load-error");
  const photoCount = document.querySelector("#photo-count");
  const viewer = document.querySelector("#viewer");
  const viewerImage = document.querySelector("#viewer-image");
  const viewerCount = document.querySelector("#viewer-count");
  const closeViewer = document.querySelector("#close-viewer");
  const previousPhoto = document.querySelector("#previous-photo");
  const nextPhoto = document.querySelector("#next-photo");
  let photos = [];
  let activeIndex = 0;

  function showPhoto(index) {
    if (!photos.length) return;
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt;
    viewerCount.textContent = `${activeIndex + 1} / ${photos.length}`;
  }

  function openViewer(index) {
    showPhoto(index);
    viewer.showModal();
    closeViewer.focus();
  }

  function render(data) {
    photos = data.photos;
    photoCount.textContent = `${photos.length} 张照片`;
    gallery.replaceChildren(...photos.map((photo, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "travel-photo";
      button.dataset.photoId = photo.id;
      button.setAttribute("aria-label", `查看第 ${index + 1} 张：${photo.alt}`);
      const image = document.createElement("img");
      image.src = photo.thumb;
      image.alt = photo.alt;
      image.loading = "eager";
      image.decoding = "async";
      button.append(image);
      button.addEventListener("click", () => openViewer(index));
      return button;
    }));
  }

  closeViewer.addEventListener("click", () => viewer.close());
  previousPhoto.addEventListener("click", () => showPhoto(activeIndex - 1));
  nextPhoto.addEventListener("click", () => showPhoto(activeIndex + 1));
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });

  fetch("travelogue.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(render)
    .catch((error) => {
      console.error("Unable to load alumni travelogue", error);
      loadError.hidden = false;
    });
})();
