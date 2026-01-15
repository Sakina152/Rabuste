import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, X, Check, Loader2 } from "lucide-react";

interface ArtistSubmissionFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ArtistSubmissionForm = ({ isOpen, onClose }: ArtistSubmissionFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const pngFiles = selectedFiles.filter(
                (file) => file.type === "image/png"
            );

            if (pngFiles.length !== selectedFiles.length) {
                setError("Only PNG files are allowed.");
                return;
            }

            if (files.length + pngFiles.length > 5) {
                setError("You can upload a maximum of 5 files.");
                return;
            }

            setFiles((prev) => [...prev, ...pngFiles]);
            setError(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            files.forEach((file) => {
                data.append("portfolio", file);
            });

            const response = await fetch(`${API_URL}/api/artist-submissions`, {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to submit portfolio");
            }

            setSuccess(true);
            setFormData({ name: "", email: "", phone: "" });
            setFiles([]);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 md:p-8 relative shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {!success ? (
                            <>
                                <div className="mb-6">
                                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                                        Submit Your Portfolio
                                    </h2>
                                    <p className="text-muted-foreground mt-2">
                                        Join our gallery. We accept PNG files only for initial review.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                            Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                            placeholder="Picasso Jr."
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                            Email Address
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                            placeholder="hello@art.com"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                            Phone Number
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                            Portfolio (PNG only, Max 5)
                                        </label>
                                        <div className="border-2 border-dashed border-border hover:border-accent/50 rounded-lg p-6 transition-colors text-center cursor-pointer relative bg-accent/5">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/png"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Upload className="w-8 h-8 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground font-medium">
                                                    Click to upload or drag and drop
                                                </span>
                                                <span className="text-xs text-muted-foreground/60">
                                                    Supports: PNG only
                                                </span>
                                            </div>
                                        </div>

                                        {files.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {files.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-xs font-medium border border-border/50"
                                                    >
                                                        <span className="truncate max-w-[150px]">
                                                            {file.name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="hero"
                                        className="w-full mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-foreground">
                                    Application Received!
                                </h3>
                                <p className="text-muted-foreground max-w-xs mx-auto">
                                    Thank you for sharing your work with us. We will review your portfolio and get back to you shortly.
                                </p>
                                <Button variant="outline" onClick={onClose} className="mt-4">
                                    Close
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ArtistSubmissionForm;
