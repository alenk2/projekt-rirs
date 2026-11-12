import { useEffect, useState, type FormEvent } from "react";

const API_URL = "http://localhost:3000";

type Technician = {
  id: number;
  fullName: string;
  email: string;
};

type Props = {
  ticketId: number;
  assignedTo: number | null;
  onAssigned: (technician: Technician) => void;
};

export default function TicketAssignment({
  ticketId,
  assignedTo,
  onAssigned,
}: Props) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [technicianId, setTechnicianId] = useState(
    assignedTo ? String(assignedTo) : ""
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTechnicians() {
      try {
        const response = await fetch(
          `${API_URL}/api/users/technicians`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch technicians");
        }

        const data: Technician[] = await response.json();

        if (!controller.signal.aborted) {
          setTechnicians(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Tehnikov ni bilo mogoče naložiti.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTechnicians();

    return () => controller.abort();
  }, []);

  async function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!technicianId) {
      setError("Izberite IT-tehnika.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/tickets/${ticketId}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            technicianId: Number(technicianId),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Assignment failed");
      }

      const data: {
        ticket: { assignee: Technician };
      } = await response.json();

      onAssigned(data.ticket.assignee);
      setSuccess("Zahtevek je bil uspešno dodeljen.");
    } catch {
      setError("Dodelitev zahtevka ni uspela.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ticket-assignment">
      <h4>Dodeljevanje IT-tehnika</h4>

      <form onSubmit={handleAssign}>
        <label htmlFor="technician-select">
          Izberi tehnika
        </label>

        <select
          id="technician-select"
          value={technicianId}
          onChange={(e) => {
            setTechnicianId(e.target.value);
            setSuccess("");
          }}
          disabled={loading || submitting}
          required
        >
          <option value="">
            {loading ? "Nalaganje..." : "Izberite tehnika"}
          </option>

          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.fullName}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={
            loading ||
            submitting ||
            !technicianId ||
            technicians.length === 0
          }
        >
          {submitting ? "Dodeljevanje..." : "Dodeli tehnika"}
        </button>
      </form>

      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
    </div>
  );
}
