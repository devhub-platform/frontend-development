// src/Components/AIChat/InputArea.jsx
import {
  Send,
  Sparkles,
  ChevronDown,
  Check,
  Paperclip,
  Mic,
  Square,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { uploadAttachment } from "../../services/aiChatApi";

const MAX_FILE_SIZE_MB = 5;

export default function InputArea({
  onSendMessage,
  selectedModelId,
  onModelChange,
  models = [],
  variant = "bottom",
  sending = false,
  attachment,
  onAttachmentChange,
  canUseAttachment = false,
}) {
  const [message, setMessage] = useState("");
  const [showModels, setShowModels] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Build image preview when attachment changes
  useEffect(() => {
    if (!attachment) {
      setImagePreview(null);
      return;
    }
    const isImage =
      attachment.mime_type?.startsWith("image/") ||
      attachment.type?.startsWith("image/") ||
      (attachment.filename || attachment.name || "").match(
        /\.(jpg|jpeg|png|gif|webp|svg)$/i,
      );

    if (isImage && attachment.url) {
      setImagePreview(attachment.url);
    } else {
      setImagePreview(null);
    }
  }, [attachment]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal)
          finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        setMessage((prev) =>
          prev ? `${prev} ${finalTranscript}` : finalTranscript,
        );
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || sending || uploading) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    onSendMessage(trimmed);
    setMessage("");
    setShowModels(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      console.error("File too large (> 5MB)");
      e.target.value = "";
      return;
    }
    try {
      setUploading(true);
      const res = await uploadAttachment(file);
      onAttachmentChange?.(res);
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = () => {
    onAttachmentChange?.(null);
    setImagePreview(null);
  };

  const selectedModelMeta =
    models.find((m) => m.id === selectedModelId) || null;

  return (
    <div className={`w-full ${variant === "center" ? "max-w-3xl" : ""}`}>
      <div className="w-full bg-white/90 dark:bg-[#0a0e1a]/90 backdrop-blur-md px-4 pb-4">
        <div className="max-w-3xl mx-auto">
          {/* Image preview above the input box */}
          {imagePreview && (
            <div className="mb-2 flex items-start gap-2 px-1">
              <div className="relative group w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/30 shadow-md">
                <img
                  src={imagePreview}
                  alt="Attachment preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Non-image file attachment */}
          {attachment && !imagePreview && (
            <div className="mb-2 mx-1">
              <div className="inline-flex items-center gap-2 text-xs bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
                <Paperclip className="w-3 h-3 text-primary" />
                <span className="truncate max-w-48 text-gray-700 dark:text-gray-300">
                  {attachment.filename || attachment.name || "Attachment"}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Main input container */}
          <div className="bg-white dark:bg-[#0f1420] border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-primary/25 focus-within:border-primary/40 transition-all">
            {/* Textarea */}
            <div className="px-4 pt-3.5 pb-2">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask DevHub AI anything..."
                className="w-full bg-transparent dark:text-gray-100 text-gray-800 placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none text-sm dark-scrollbar max-h-36 leading-relaxed"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>

            {/* Bottom toolbar */}
            <div className="px-3 pb-3 flex items-center justify-between gap-2">
              {/* Left: attach */}
              <div className="flex items-center gap-1">
                {canUseAttachment ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/8 rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5"
                      title="Attach image"
                    >
                      {uploading ? (
                        <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <ImageIcon size={17} />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*,.pdf,.txt,.csv,.json"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="px-2 text-[10px] text-gray-300 dark:text-gray-600 italic">
                    Vision not available
                  </div>
                )}
              </div>

              {/* Right: model picker + mic + send */}
              <div className="flex items-center gap-1.5">
                {/* Model selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModels((v) => !v)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-full text-[11px] dark:text-gray-300 text-gray-600 border border-gray-200 dark:border-gray-700/60 hover:border-primary/40 transition-all"
                  >
                    <Sparkles size={10} className="text-primary" />
                    <span className="max-w-28 truncate">
                      {selectedModelMeta
                        ? selectedModelMeta.title
                        : selectedModelId || "Model"}
                    </span>
                    <ChevronDown size={10} />
                  </button>

                  {showModels && (
                    <div className="absolute bottom-9 right-0 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider z-100">
                          Select Model
                        </p>
                      </div>
                      {models.map((m) => (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => {
                            onModelChange(m.id);
                            setShowModels(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-xs dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{m.title}</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                              {m.best_for}
                            </span>
                            {m.vision && (
                              <span className="text-[10px] text-blue-500 flex items-center gap-1">
                                <ImageIcon size={9} /> Supports images
                              </span>
                            )}
                          </div>
                          {selectedModelId === m.id && (
                            <Check
                              size={12}
                              className="text-primary shrink-0"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mic */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-all ${
                    isListening
                      ? "bg-primary text-white shadow-md shadow-primary/30 animate-pulse"
                      : "text-gray-400 hover:text-primary hover:bg-primary/8"
                  }`}
                >
                  {isListening ? (
                    <Square size={14} fill="currentColor" />
                  ) : (
                    <Mic size={16} />
                  )}
                </button>

                {/* Send */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!message.trim() || sending || uploading}
                  className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/25"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 text-center">
            DevHub AI can make mistakes. Review important answers before using
            them.
          </p>
        </div>
      </div>
    </div>
  );
}
