"use client";

import { useState } from "react";
import { Upload, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function UploadProofForm({ orderId }: { orderId: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("order_id", orderId);

    try {
      const res = await fetch("/api/upload-proof", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al subir el comprobante");
      } else {
        toast.success("Comprobante enviado correctamente");
        setUploaded(true);
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setUploading(false);
    }
  }

  if (uploaded) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <Check className="h-5 w-5" />
        Comprobante enviado. Lo revisaremos a la brevedad.
      </div>
    );
  }

  return (
    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-brand-blue hover:bg-blue-50/50 transition-colors">
      {uploading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
          <span className="text-sm text-gray-600">Subiendo...</span>
        </>
      ) : (
        <>
          <Upload className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            Hacé click para subir tu comprobante (JPG, PNG, WebP)
          </span>
        </>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
      />
    </label>
  );
}
