// References:
// - https://blog.mturk.com/tutorial-generating-images-with-bounding-boxes-on-the-fly-using-aws-lambda-690d2301a5ff
// - https://cloud.google.com/vision/docs/reference/rest/v1p2beta1/images/annotate

import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import Sharp from "sharp";
import { ImageSize, ResponseObj } from "../components/DropZoneLayout";

/**
 * Call vision-backend-app API to detect objects in the uploaded image
 * @param file
 */
export async function detectObject(file: File) {
  const form = new FormData();
  form.append("image", file);
  const url =
    "https://1yr2b13jq9.execute-api.ap-southeast-1.amazonaws.com/dev/detect";
  const options: AxiosRequestConfig = {
    method: "post",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: form,
    url,
  };

  const response = await axios(options);
  console.log(response);
  return response;
}

/**
 * Draw bounding boxes with a given file (image), image size, and the vertices stored in ResponseObj object array.
 * @param imageURL
 * @param imageSize
 * @param resObjs
 */
export async function drawBoundingBoxes(
  imageURL: string,
  imageSize: ImageSize,
  resObjs: ResponseObj[]
) {
  // We will generate an array of SVG rectangles
  let svgRectangles: string[] = [];
  // console.log(imageFile);
  console.log(imageSize);
  console.log(resObjs);
  resObjs.forEach((obj) => {
    // Generate a new random hex color for each bounding box
    let boxColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Will be something like #FF9900

    // For each bounding box, we generate an SVG rectangle as described here:
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect
    // The order of vertices stored in ResponseObj started from bottom left of the box, and goes anti-clockwise.
    const width = obj.bounds[3].y - obj.bounds[0].y;
    const height = obj.bounds[1].x - obj.bounds[0].x;
    svgRectangles.push(
      ` <rect height="` +
        height +
        `" width="` +
        width +
        `" x="` +
        obj.bounds[0].x +
        `" y="` +
        obj.bounds[0].y +
        `"
      style="fill: none; stroke: ` +
        boxColor +
        `; stroke-width: 5"/>`
    );
  });

  const image = Sharp(imageURL);
  image.metadata().then(async (metadata: { height: string; width: string; }) => {
      let svgElement = `<svg height="` +
        metadata.height +
        `" width="` +
        metadata.width +
        `" viewbox="0 0 ` +
        metadata.width +
        ` ` +
        metadata.height +
        `" xmlns="http://www.w3.org/2000/svg">`;
      svgElement += svgRectangles.join();
      svgElement += `</svg>`;

      // The SVG string we have crafted above needs to be converted into a Buffer object
      // so that we can use Sharp to overlay it with our image buffer
      const svgElementBuffer = new Buffer(svgElement);

      // Create a random file name for the rendered image file we will create
      // Note we are assuming all images being passed in are JPEGs to keep things simple
      // Now we create a new image buffer combining the original image buffer with the buffer we generated
      // with our SVG bounding box rectangles
      await image.composite([{ input: svgElementBuffer }]).toBuffer();
    });
}
