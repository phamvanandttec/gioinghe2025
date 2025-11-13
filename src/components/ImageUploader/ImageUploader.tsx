'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  onImageRemove?: () => void;
}

export default function ImageUploader({ currentImage, onImageChange, onImageRemove }: Readonly<ImageUploaderProps>) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onImageChange(result.url);
      } else {
        alert(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = async () => {
    if (!currentImage) return;

    // If it's an uploaded image, delete it from server
    if (currentImage.startsWith('/uploads/')) {
      try {
        const filename = currentImage.split('/uploads/')[1];
        const response = await fetch(`/api/upload?filename=${filename}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          console.error('Failed to delete image from server');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    if (onImageRemove) {
      onImageRemove();
    } else {
      onImageChange('');
    }
  };

  const displayImage = currentImage || '/images/placeholder.svg';

  return (
    <div className={styles.container}>
      <div className={styles.imagePreview}>
        <Image
          src={displayImage}
          alt="Product image"
          width={300}
          height={200}
          style={{ objectFit: 'cover' }}
          className={styles.image}
        />
        
        {currentImage && currentImage !== '/images/placeholder.svg' && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className={styles.removeButton}
            title="Remove image"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="button"
        className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''} ${uploading ? styles.uploading : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Click or drag to upload image"
        disabled={uploading}
      >
        {uploading ? (
          <div className={styles.uploadingState}>
            <div className={styles.spinner}></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <div className={styles.uploadIcon}>📁</div>
            <p>Click to upload or drag and drop</p>
            <small>JPEG, PNG, WebP, GIF (max 5MB)</small>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileInputChange}
        className={styles.hiddenInput}
      />

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={styles.uploadButton}
          disabled={uploading}
        >
          {currentImage && currentImage !== '/images/placeholder.svg' ? 'Change Image' : 'Upload Image'}
        </button>
        
        {currentImage && currentImage !== '/images/placeholder.svg' && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className={styles.removeTextButton}
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}