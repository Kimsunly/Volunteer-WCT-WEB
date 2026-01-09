"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
/**
 * UploadArea
 * - Click / drag-and-drop file upload with preview
 *
 * Props:
 * - accept: string (default "image/*,.pdf,.doc,.docx")
 * - onFile: (file) => void
 */
export default function UploadArea({
  accept = "image/*,.pdf,.doc,.docx",
  onFile,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [hover, setHover] = useState(false);

  const openFile = () => inputRef.current?.click();

  const handleFile = (file) => {
    if (!file) return;
    setFileInfo({ name: file.name, sizeKB: (file.size / 1024).toFixed(2) });
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onFile?.(file);
  };

  const onChange = (e) => handleFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) handleFile(files[0]);
    setHover(false);
  };

  return (
    <div
      className="wrapper"
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setHover(false);
      }}
      onDrop={onDrop}
    >
      <div
        className="upload"
        id="upload-area"
        role="button"
        style={{ cursor: "pointer", opacity: hover ? 0.8 : 1 }}
        onClick={openFile}
      >
        <div className="border p-3 text-center">
          <div className="icons fa-2x mb-2">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8 }}
              />
            ) : (
              <>
                <i className="fas fa-file-image me-2"></i>
                <i className="fas fa-file-alt me-2"></i>
                <i className="fas fa-file-pdf"></i>
              </>
            )}
          </div>
          <p id="upload-text" className="mb-0">
            បញ្ចូលរូបសញ្ញាអង្គការ{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openFile();
              }}
            >
              រុករក
            </a>{" "}
            កុំព្យូទ័ររបស់អ្នក
          </p>
          {fileInfo && (
            <div className="mt-2">
              <i className="fas fa-check-circle text-success me-2"></i>
              <strong>{fileInfo.name}</strong>
              <br />
              <small className="text-muted">{fileInfo.sizeKB} KB</small>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            hidden
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
