import { useEffect, useState } from "react";
import "./TicketList.css";
import TicketAssignment from "./TicketAssignment";
import TicketStatusActions from "./TicketStatusActions";

const API_URL = "http://localhost:3000";

type UserRole = "EMPLOYEE" | "TECHNICIAN" | "ADMIN";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type Ticket = {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  impact: string;
  urgency: string;
  resolution: string | null;
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    fullName: string;
  };
  assignee: {
    id: number;
    fullName: string;
  } | null;
};

type Props = {
  role: UserRole;
  currentUserId: number;
  refreshKey?: number;
};

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Odprt",
  IN_PROGRESS: "V obravnavi",
  RESOLVED: "Rešen",
  CLOSED: "Zaključen",
};

const priorityLabels: Record<Priority, string> = {
  LOW: "Nizka",
  MEDIUM: "Srednja",
  HIGH: "Visoka",
  CRITICAL: "Kritična",
};

export default function TicketList({
  role,
  currentUserId,
  refreshKey = 0,
}: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTickets() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (status) params.set("status", status);
        if (priority) params.set("priority", priority);

        const query = params.toString();

        const url = `${API_URL}/api/tickets${query ? `?${query}` : ""}`;

        const response = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data: Ticket[] = await response.json();

        if (!controller.signal.aborted) {
          setTickets(data);
          setSelectedTicket(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Zahtevkov ni bilo mogoče naložiti.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTickets();

    return () => controller.abort();
  }, [status, priority, role, refreshKey]);

  function resetFilters() {
    setStatus("");
    setPriority("");
  }


    function handleAssigned(
    ticketId: number,
    technician: { id: number; fullName: string }
    ) {
    setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
        ticket.id === ticketId
            ? {
                ...ticket,
                assignee: technician,
            }
            : ticket
        )
    );
    }


    function handleStatusUpdated(
    ticketId: number,
    update: {
        status: TicketStatus;
        resolution: string | null;
    }
    ) {
    setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
        ticket.id === ticketId
            ? {
                ...ticket,
                status: update.status,
                resolution: update.resolution,
            }
            : ticket
        )
    );
    }


  return (
    <section className="ticket-list-card">
      <div className="ticket-list-header">
        <div>
          <h2>
            {role === "EMPLOYEE"
              ? "Moji zahtevki"
              : role === "TECHNICIAN"
                ? "Dodeljeni zahtevki"
                : "Vsi zahtevki"}
          </h2>
          <p>Pregled IT zahtevkov in njihovega stanja.</p>
        </div>
      </div>

      <div className="ticket-filters">
        <div>
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Vsi statusi</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority-filter">Prioriteta</label>
          <select
            id="priority-filter"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Vse prioritete</option>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button type="button" onClick={resetFilters}>
          Ponastavi filtre
        </button>
      </div>

      {loading && <p role="status">Nalaganje zahtevkov...</p>}

      {error && <p className="list-error" role="alert">{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <div className="empty-tickets">
          <p>Ni zahtevkov za izbrane filtre.</p>
          <button type="button" onClick={resetFilters}>
            Ponastavi filtre
          </button>
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <>
          <p className="ticket-count">
            Število zahtevkov: {tickets.length}
          </p>

          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Naslov</th>
                  <th>Kategorija</th>
                  <th>Prioriteta</th>
                  <th>Status</th>
                  <th>Tehnik</th>
                  <th>Datum</th>
                  <th>Podrobnosti</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.category.name}</td>
                    <td>
                      <span className={`priority priority-${ticket.priority.toLowerCase()}`}>
                        {priorityLabels[ticket.priority]}
                      </span>
                    </td>
                    <td>
                      <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>
                        {statusLabels[ticket.status]}
                      </span>
                    </td>
                    <td>
                      {ticket.assignee?.fullName ?? "Ni dodeljen"}
                    </td>
                    <td>
                      {new Date(ticket.createdAt).toLocaleDateString("sl-SI")}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="details-button"
                        aria-expanded={selectedTicket === ticket.id}
                        onClick={() =>
                          setSelectedTicket(
                            selectedTicket === ticket.id ? null : ticket.id
                          )
                        }
                      >
                        {selectedTicket === ticket.id ? "Zapri" : "Poglej"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedTicket !== null && (() => {
            const ticket = tickets.find((t) => t.id === selectedTicket);

            if (!ticket) return null;

            return (
              <div className="ticket-details">
                <h3>Zahtevek #{ticket.id}: {ticket.title}</h3>

                <p><strong>Prijavitelj:</strong> {ticket.creator.fullName}</p>
                <p><strong>Kategorija:</strong> {ticket.category.name}</p>
                <p><strong>Opis:</strong> {ticket.description}</p>
                <p><strong>Vpliv:</strong> {ticket.impact}</p>
                <p><strong>Nujnost:</strong> {ticket.urgency}</p>
                <p><strong>Status:</strong> {statusLabels[ticket.status]}</p>
                <p><strong>Prioriteta:</strong> {priorityLabels[ticket.priority]}</p>

                {ticket.resolution && (
                  <p><strong>Rešitev:</strong> {ticket.resolution}</p>
                )}


                {role === "ADMIN" && ticket.status !== "CLOSED" && (
                <TicketAssignment
                    key={ticket.id}
                    ticketId={ticket.id}
                    assignedTo={ticket.assignee?.id ?? null}
                    onAssigned={(technician) =>
                    handleAssigned(ticket.id, technician)
                    }
                />
                )}
                
                
                <TicketStatusActions
                ticketId={ticket.id}
                status={ticket.status}
                creatorId={ticket.creator.id}
                assignedTo={ticket.assignee?.id ?? null}
                currentUserId={currentUserId}
                currentUserRole={role}
                onUpdated={(update) =>
                    handleStatusUpdated(ticket.id, update)
                }
                />


              </div>
            );
          })()}
        </>
      )}
    </section>
  );
}
