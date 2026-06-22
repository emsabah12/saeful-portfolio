"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Heading2,
} from "lucide-react";
import { uploadImageAction } from "@/features/upload/actions";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        allowBase64: false, // Kita wajib pakai URL Supabase, bukan base64 biar DB tidak bengkak
        HTMLAttributes: {
          class:
            "rounded-xl my-6 max-w-full h-auto border border-gray-200 shadow-sm",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Kirim perubahan HTML ke React Hook Form
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[250px] p-4 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900",
      },
    },
  });

  if (!editor) return null;

  // Fungsi mengunggah gambar langsung saat tombol di toolbar diklik
  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "project_details"); // Folder khusus di Supabase Storage

    try {
      const result = await uploadImageAction(formData);
      if (result.success && result.url) {
        // Sisipkan gambar ke posisi kursor aktif di dalam teks editor
        editor.chain().focus().setImage({ src: result.url }).run();
      } else {
        alert("Gagal mengunggah gambar ke server.");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem saat mengunggah gambar.");
    } finally {
      e.target.value = ""; // Reset input file
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-md overflow-hidden shadow-sm">
      {/* TOOLBAR EDITOR */}
      <div className="flex flex-wrap items-center gap-1 bg-gray-50 p-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive("bold") ? "bg-gray-200 text-black" : "text-gray-600"}`}
          title="Tebal"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive("italic") ? "bg-gray-200 text-black" : "text-gray-600"}`}
          title="Miring"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black" : "text-gray-600"}`}
          title="Sub-Judul"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="h-6 w-[1px] bg-gray-300 mx-1" /> {/* Separator */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive("bulletList") ? "bg-gray-200 text-black" : "text-gray-600"}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive("orderedList") ? "bg-gray-200 text-black" : "text-gray-600"}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="h-6 w-[1px] bg-gray-300 mx-1" />
        {/* TOMBOL INSERT IMAGE */}
        <label
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition cursor-pointer flex items-center justify-center"
          title="Sisipkan Gambar"
        >
          <ImageIcon className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            onChange={addImage}
            className="hidden"
          />
        </label>
      </div>

      {/* AREA KETIK UTAMA */}
      <EditorContent editor={editor} />
    </div>
  );
}
