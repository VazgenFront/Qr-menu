import React, { useState } from "react";
import "./UploadImage.css";
import FolderIcon from "./folder_icon.png";
import CloseIcon from "./CloseIcon.svg";
import axios from "axios";
function UploadImage({ image, setImage, token }) {
  const [isUploaded, setIsUploaded] = useState(false);

  const handleImageChange = async (e) => {
    const formData = new FormData();
    formData.append("up-img", e.target.files[0], e.target.files[0].name);
    const result = await axios.post(
      "http://localhost:4000/api/account/image-upload",
      formData,
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (result && result.data && result.data.url) {
      setImage("http://localhost:4000/" + result.data.url);
    }
  };

  return (
    <div className="layout">
      <div className="Container">
        <div className="BoxUpload">
          <div className="image-upload">
            {!isUploaded ? (
              <>
                <label htmlFor="upload-input">
                  <img
                    src={FolderIcon}
                    draggable={"false"}
                    alt="placeholder"
                    style={{ width: "20px", height: "20px" }}
                  />
                </label>

                <input
                  style={{ marginLeft: "62px" }}
                  id="upload-input"
                  type="file"
                  accept=".jpg,.jpeg,.gif,.png"
                  onChange={handleImageChange}
                />
              </>
            ) : (
              <div className="ImagePreview">
                <img
                  className="close-icon"
                  src={CloseIcon}
                  alt="CloseIcon"
                  onClick={() => {
                    setIsUploaded(false);
                    setImage(null);
                  }}
                />

                <img
                  id="uploaded-image"
                  src={image}
                  draggable={false}
                  alt="uploaded-img"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
