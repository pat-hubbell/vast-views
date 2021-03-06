export default function unsplashApi() {
  // Initialize the imageOptions to the default both (Portrait and landscape)
  let imageOptions = "both";

  // Declare loader and imageContainer, which will hold these elements in the document
  let loader;
  let imageContainer;

  // imagesArray will hold the images in the response from the Unsplash API
  // readyToLoadMore becomes true when images from current response are all loaded
  // imagesLoaded is the current number of images loaded
  // totalImages is the total number of images given in the current API response
  let imagesArray = [];
  let readyToLoadMore = false;
  let imagesLoaded = 0;
  let totalImages = 0;

  // Initial number of images to be requested from the API is 5 in order to
  // reduce initial loading times
  let imageLoadCount = 10;

  // Initialize API urls for each possible request (Portrait nature images, landscape, or both)
  const apiUrlBoth = `/api/random/both/${imageLoadCount}`;
  const apiUrlPortrait = `/api/random/portrait/${imageLoadCount}`;
  const apiUrlLandscape = `/api/random/landscape/${imageLoadCount}`;

  // Check if all the images were loaded
  const imageLoaded = () => {
    imagesLoaded++;

    // If we loaded all images from current response, we can load more
    if (imagesLoaded === totalImages) {
      readyToLoadMore = true;
      loader.hidden = true;
    }
  };

  // Create elements for images to display to user
  const displayImages = () => {
    // Reset the number of images that have been loaded from latest response
    imagesLoaded = 0;

    // Set the total images count to the number of images given in the latest response
    totalImages = imagesArray.length;

    // Populate the images container
    imagesArray.forEach((image) => {
      console.log(image);
      // image.user.profile_image.small

      // Create the image and information container
      const container = document.createElement("div");
      container.setAttribute("class", "image-and-info-container");

      // Create a link to the photo's Unsplash page
      const item = document.createElement("a");
      item.setAttribute("href", image.links.html);
      item.setAttribute("target", "_blank");

      // Create the image
      const img = document.createElement("img");
      img.setAttribute("src", image.urls.regular);
      img.setAttribute("alt", image.alt_description);
      img.setAttribute("title", image.alt_description);

      // Create the information container
      const info = document.createElement("div");
      info.setAttribute("class", "image-info");

      // Create the author name element
      const authorName = document.createElement("p");
      authorName.setAttribute("class", "image-author-name");
      authorName.textContent = image.user.name;

      // Create the author profile image element
      const authorPic = document.createElement("img");
      authorPic.setAttribute("src", image.user.profile_image.small);
      authorPic.setAttribute("alt", "");
      authorPic.setAttribute("title", "");
      authorPic.setAttribute("class", "image-author-pic");

      // Create author link
      const authorLink = document.createElement("a");
      authorLink.setAttribute(
        "href",
        `https://unsplash.com/@${image.user.username}`
      );
      authorLink.setAttribute("target", "_blank");
      authorLink.setAttribute("class", "image-author-link");

      // Create the image download link
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", image.links.download);
      downloadLink.setAttribute("target", "_blank");
      downloadLink.setAttribute("download", "image.png");
      downloadLink.setAttribute("class", "image-download-link");

      // Create the image download icon
      const downloadIcon = document.createElement("p");
      downloadIcon.textContent = "Download";

      // Check when the image is finished loading
      img.addEventListener("load", imageLoaded);

      // Put the image inside the link, put the link in the image container
      item.appendChild(img);
      container.appendChild(item);
      authorLink.append(authorName);
      downloadLink.append(downloadIcon);
      info.appendChild(authorPic);
      info.appendChild(authorLink);
      info.appendChild(downloadLink);
      container.appendChild(info);
      imageContainer.appendChild(container);
    });
  };

  // Empty the image container and request 5 new images corresponding to the
  // new image option selection
  const resetImages = () => {
    let imageContainer = document.getElementById("image-container");

    // Empty the image container
    imageContainer.textContent = "";

    // Scroll to the top of the page
    window.scrollTo(0, 0);

    // Make the loading screen visible
    loader.hidden = false;

    // Reset imageLoadCount to its intial value
    imageLoadCount = 10;

    // Request the new images from the API
    getImages();
  };

  // Get photos from the Unsplash API
  const getImages = async () => {
    try {
      let response;

      // Request images from the API with the url string corresponding to the
      // current image option selection
      if (imageOptions === "both") {
        response = await fetch(apiUrlBoth);
      } else if (imageOptions === "portrait") {
        response = await fetch(apiUrlPortrait);
      } else if (imageOptions === "landscape") {
        response = await fetch(apiUrlLandscape);
      }

      // Get the images array
      const result = await response.json();

      if (result.success) {
        imagesArray = result.imagesArray;
      } else {
        console.error(result.message);
      }

      // If the imageLoadCount is set to the initial value of 10, change the
      // value to 30
      if (imageLoadCount === 10) {
        imageLoadCount = 30;
      }

      // Load and display the new images
      displayImages();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Whenever the image options form is clicked, check to see if a new
  // image option has been selected
  const getImageOptions = () => {
    document
      .getElementById("image-options-form")
      .addEventListener("click", () => {
        // If the current checked image option does not match the
        // previously recorded selection, we know a new option has been
        // selected, and we need to reset our image container
        if (
          document.getElementById("portrait").checked &&
          imageOptions !== "portrait"
        ) {
          imageOptions = "portrait";
          resetImages();
        } else if (
          document.getElementById("landscape").checked &&
          imageOptions !== "landscape"
        ) {
          imageOptions = "landscape";
          resetImages();
        } else if (
          document.getElementById("both").checked &&
          imageOptions !== "both"
        ) {
          imageOptions = "both";
          resetImages();
        }
      });
  };

  // Define each variable that holds a document element
  const getDocumentElements = () => {
    loader = document.getElementById("loader");
    imageContainer = document.getElementById("image-container");
  };

  // Check if scrolling near bottom of page, if so then load more images
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1000 &&
      readyToLoadMore
    ) {
      // Set readyToLoadMore to false since 30 new images must be loaded
      readyToLoadMore = false;

      // Request the 30 new images
      getImages();
    }
  });

  return { getDocumentElements, getImages, getImageOptions };
}
