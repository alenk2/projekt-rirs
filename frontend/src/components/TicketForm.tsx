import { useEffect, useState, type FormEvent } from "react";
import "./TicketForm.css";

const API_URL = "http://localhost:3000";

type Level = "LOW" | "MEDIUM" | "HIGH";

type Category = {
  id: number;
  name: string;
};

type CreatedTicket = {
  id: number;
  title: string;
  status: string;
};

type TicketFormProps = {
  onCreated?: () => void;
};

export default function TicketForm({ onCreated }: TicketFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [impact, setImpact] = useState<Level>("LOW");
  const [urgency, setUrgency] = useState<Level>("LOW");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<CreatedTicket | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/api/categories`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch {
        if (!controller.signal.aborted) {
          setError("Kategorij ni bilo mogoče naložiti.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCategories(false);
        }
      }
    }

    void loadCategories();

    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(null);

    if (!title.trim() || !description.trim() || !categoryId) {
      setError("Izpolnite vsa obvezna polja.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          categoryId: Number(categoryId),
          impact,
          urgency,
        }),
      });

      if (!response.ok) {
        throw new Error("Ticket creation failed");
      }

      const data: { ticket: CreatedTicket } = await response.json();

      setSuccess(data.ticket);
      onCreated?.();

      // Ponastavimo obrazec.
      setTitle("");
      setDescription("");
      setCategoryId("");
      setImpact("LOW");
      setUrgency("LOW");
    } catch {
      setError("Zahtevka ni bilo mogoče oddati.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="ticket-form-card">
      <h2>Nov IT zahtevek</h2>
      <p>Opišite težavo, za katero potrebujete IT podporo.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="ticket-title">Naslov težave</label>
        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          placeholder="Npr. Računalnik se ne prižge"
        />

        <label htmlFor="ticket-description">Opis težave</label>
        <textarea
          id="ticket-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          placeholder="Podrobneje opišite težavo..."
        />

        <label htmlFor="ticket-category">Kategorija</label>
        <select
          id="ticket-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          disabled={loadingCategories}
        >
          <option value="">
            {loadingCategories
              ? "Nalaganje kategorij..."
              : "Izberite kategorijo"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="ticket-impact">Vpliv težave</label>
        <select
          id="ticket-impact"
          value={impact}
          onChange={(e) => setImpact(e.target.value as Level)}
        >
          <option value="LOW">Nizek</option>
          <option value="MEDIUM">Srednji</option>
          <option value="HIGH">Visok</option>
        </select>

        <label htmlFor="ticket-urgency">Nujnost</label>
        <select
          id="ticket-urgency"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as Level)}
        >
          <option value="LOW">Nizka</option>
          <option value="MEDIUM">Srednja</option>
          <option value="HIGH">Visoka</option>
        </select>

        {error && (
          <p className="form-error" role="alert">{error}</p>
        )}

        {success && (
          <div className="form-success" role="status">
            Zahtevek #{success.id} je bil uspešno oddan!
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || loadingCategories || categories.length === 0}
        >
          {submitting ? "Oddajanje..." : "Oddaj zahtevek"}
        </button>
      </form>
    </section>
  );
}
