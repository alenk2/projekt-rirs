import { useEffect, useState, type FormEvent } from "react";
import "./TicketComments.css";

const API_URL = "http://localhost:3000";

type Comment = {
  id: number;
  ticketId: number;
  authorId: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    fullName: string;
    role: "EMPLOYEE" | "TECHNICIAN" | "ADMIN";
  };
};

type Props = {
  ticketId: number;
  isClosed: boolean;
};

export default function TicketComments({
  ticketId,
  isClosed,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Naložimo komentarje iz baze.
  useEffect(() => {
    const controller = new AbortController();

    async function loadComments() {
      setLoading(true);
      setError("");
      setSuccess("");
      setComments([]);

      try {
        const response = await fetch(
          `${API_URL}/api/tickets/${ticketId}/comments`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data: Comment[] = await response.json();

        if (!controller.signal.aborted) {
          setComments(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Komentarjev ni bilo mogoče naložiti.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadComments();

    return () => controller.abort();
  }, [ticketId]);

  // Pošljemo nov komentar.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || trimmedContent.length > 2000) {
      setError("Komentar mora vsebovati od 1 do 2000 znakov.");
      return;
    }

    if (isClosed || submitting) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/tickets/${ticketId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: trimmedContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const data: { comment: Comment } = await response.json();

      // Dodamo komentar na konec seznama.
      setComments((previousComments) => [
        ...previousComments,
        data.comment,
      ]);

      setContent("");
      setSuccess("Komentar je bil uspešno objavljen.");
    } catch {
      setError("Komentarja ni bilo mogoče poslati.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="ticket-comments">
      <h4>Komentarji</h4>

      {loading && <p>Nalaganje komentarjev...</p>}

      {!loading && comments.length === 0 && !error && (
        <p className="comments-empty">
          Za ta zahtevek še ni komentarjev.
        </p>
      )}

      {!loading && comments.length > 0 && (
        <div className="comments-list">
          {comments.map((comment) => (
            <div className="comment-card" key={comment.id}>
              <div className="comment-header">
                <div>
                  <strong>{comment.author.fullName}</strong>
                  <span className="comment-role">
                    {comment.author.role === "EMPLOYEE"
                      ? "Zaposleni"
                      : comment.author.role === "TECHNICIAN"
                        ? "IT-tehnik"
                        : "Administrator"}
                  </span>
                </div>

                <time dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString(
                    "sl-SI",
                    {
                      dateStyle: "short",
                      timeStyle: "short",
                    }
                  )}
                </time>
              </div>

              <p className="comment-content">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {isClosed ? (
        <p className="comments-closed">
          Zahtevek je zaključen. Dodajanje komentarjev ni več mogoče.
        </p>
      ) : (
        <form className="comment-form" onSubmit={handleSubmit}>
          <label htmlFor={`comment-content-${ticketId}`}>
            Nov komentar
          </label>

          <textarea
            id={`comment-content-${ticketId}`}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSuccess("");
            }}
            placeholder="Napišite sporočilo..."
            rows={4}
            maxLength={2000}
            disabled={submitting || loading}
            required
          />

          <div className="comment-form-footer">
            <span>{content.length}/2000 znakov</span>

            <button
              type="submit"
              disabled={submitting || loading || !content.trim()}
            >
              {submitting
                ? "Pošiljanje..."
                : "Pošlji komentar"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="comments-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="comments-success" role="status">
          {success}
        </p>
      )}
    </section>
  );
}
