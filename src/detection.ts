import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import { JSONResponse } from "../components/DropZoneLayout";

/**
 * Call vision-backend-app API to detect objects in the uploaded image
 * @param file
 */
export async function detectObject(file: File): Promise<JSONResponse> {
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
  return response.data;
}
