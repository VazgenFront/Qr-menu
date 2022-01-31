import React, { useState } from "react";
import "./UploadImage.css";
import FolderIcon from "./folder_icon.png";
import CloseIcon from "./CloseIcon.svg";

function UploadImage({ image, setImage }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [typeFile, setTypeFile] = useState("");

  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setTypeFile(e.target.files[0].type);
      let reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target.result);
        setIsUploaded(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

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
