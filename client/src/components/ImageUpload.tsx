import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface ImageUploadProps {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
    maxSize?: number; // in MB
    accept?: string;
    label?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    multiple = false,
    maxSize = 10,
    accept = 'image/jpeg,image/png,image/gif,image/webp',
    label = 'Upload Image',
    className = ''
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const images = Array.isArray(value) ? value : value ? [value] : [];

    const validateFile = (file: File): boolean => {
        // Check file type
        const acceptedTypes = accept.split(',').map(t => t.trim());
        if (!acceptedTypes.some(type => file.type.match(type.replace('*', '.*')))) {
            setError(`Invalid file type. Accepted: ${accept}`);
            return false;
        }

        // Check file size
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`File too large. Max size: ${maxSize}MB`);
            return false;
        }

        setError('');
        return true;
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const validFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                validFiles.push(files[i]);
            }
        }

        if (validFiles.length === 0) return;

        try {
            const base64Images = await Promise.all(
                validFiles.map(file => fileToBase64(file))
            );

            if (multiple) {
                onChange([...images, ...base64Images]);
            } else {
                onChange(base64Images[0]);
            }
        } catch (err) {
            setError('Failed to process image');
            console.error('Image upload error:', err);
        }
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = (index: number) => {
        if (multiple) {
            const newImages = images.filter((_, i) => i !== index);
            onChange(newImages);
        } else {
            onChange('');
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-mono text-slate-300 mb-2">
                {label}
            </label>

            {/* Upload Zone */}
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-all duration-300
                    ${isDragging
                        ? 'border-electric-500 bg-electric-500/10'
                        : 'border-white/20 bg-void-900/50 hover:border-electric-500/50 hover:bg-void-900'
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-electric-600/20 flex items-center justify-center">
                        <span className="text-3xl">📸</span>
                    </div>
                    <div>
                        <p className="text-white font-mono mb-1">
                            {isDragging ? 'Drop image here' : 'Drag & drop or click to browse'}
                        </p>
                        <p className="text-xs text-slate-500">
                            {accept.split(',').map(t => t.split('/')[1]).join(', ').toUpperCase()} • Max {maxSize}MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-400 font-mono">
                    ⚠️ {error}
                </p>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={img}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-white/10"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(index);
                                }}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
