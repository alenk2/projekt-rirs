import { useState, type FormEvent } from "react";

const API_URL = "http://localhost:3000";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type UserRole = "EMPLOYEE" | "TECHNICIAN" | "ADMIN";

type TicketUpdate = {
  status: TicketStatus;
  resolution: string | null;
};

type Props = {
  ticketId: number;
  status: TicketStatus;
  creatorId: number;
  assignedTo: number | null;
  currentUserId: number;
  currentUserRole: UserRole;
  onUpdated: (update: TicketUpdate) => void;
};

export default function TicketStatusActions({
  ticketId,
  status,
  creatorId,
  assignedTo,
  currentUserId,
  currentUserRole,
  onUpdated,
}: Props) {
  const [resolution, setResolution] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAssignedTechnician =
    currentUserRole === "TECHNICIAN" &&
    assignedTo === currentUserId;

  const isCreator =
    currentUserRole === "EMPLOYEE" &&
    creatorId === currentUserId;

  const canStart =
    isAssignedTechnician && status === "OPEN";

  const canResolve =
    isAssignedTechnician && status === "IN_PROGRESS";

  const canClose =
    isCreator && status === "RESOLVED";

  if (!canStart && !canResolve && !canClose) {
    return null;
  }

  async function updateStatus(
    newStatus: TicketStatus,
    resolutionText?: string
  ) {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/tickets/${ticketId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
            ...(resolutionText !== undefined
              ? { resolution: resolutionText }
              : {}),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      const data: { ticket: TicketUpdate } = await response.json();

      onUpdated({
        status: data.ticket.status,
        resolution: data.ticket.resolution,
      });

      setResolution("");
    } catch {
      setError("Sprememba statusa ni uspela.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleResolve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!resolution.trim()) {
      setError("Vnesite opis rešitve.");
      return;
    }

    void updateStatus("RESOLVED", resolution.trim());
  }

  return (
    <div className="ticket-status-actions">
      <h4>Obravnava zahtevka</h4>

      {canStart && (
        <button
          type="button"
          onClick={() => void updateStatus("IN_PROGRESS")}
          disabled={submitting}
        >
          {submitting ? "Posodabljanje..." : "Začni obravnavo"}
        </button>
      )}

      {canResolve && (
        <form onSubmit={handleResolve}>
          <label htmlFor={`resolution-${ticketId}`}>
            Opis rešitve
          </label>
          <textarea
            id={`resolution-${ticketId}`}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            rows={4}
            required
            placeholder="Opišite, kako ste odpravili težavo..."
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Shranjevanje..." : "Označi kot rešeno"}
          </button>
        </form>
      )}

      {canClose && (
        <button
          type="button"
          onClick={() => void updateStatus("CLOSED")}
          disabled={submitting}
        >
          {submitting ? "Zaključevanje..." : "Zaključi zahtevek"}
        </button>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
