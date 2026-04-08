import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as BigCalendar,
  Views,
  dateFnsLocalizer,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enCA } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: enCA }),
  getDay,
  locales: { "en-CA": enCA },
});

interface ProviderCalendarProps {
  providerId: number;
  bookings: any[];
}

export function ProviderCalendar({ providerId, bookings }: ProviderCalendarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<any>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showBlackoutModal, setShowBlackoutModal] = useState(false);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [blackoutForm, setBlackoutForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [seriesForm, setSeriesForm] = useState({
    serviceId: "",
    visitCount: 4,
    startDate: "",
    frequencyDays: 7,
    timeSlot: "09:00",
    patientAddress: "",
  });

  const { data: blackouts = [] } = useQuery({
    queryKey: ["/api/providers", providerId, "blackouts"],
    queryFn: () =>
      apiRequest("GET", `/api/providers/${providerId}/blackouts`).then((r) => r.json()),
    enabled: !!providerId,
  });

  const { data: providerServices = [] } = useQuery({
    queryKey: ["/api/providers", providerId, "services"],
    queryFn: () =>
      apiRequest("GET", `/api/providers/${providerId}/services`).then((r) => r.json()),
    enabled: !!providerId,
  });

  const addBlackoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/providers/${providerId}/blackouts`, {
        startDate: blackoutForm.startDate,
        endDate: blackoutForm.endDate,
        reason: blackoutForm.reason || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "blackouts"] });
      setShowBlackoutModal(false);
      setBlackoutForm({ startDate: "", endDate: "", reason: "" });
      toast({ title: "Blackout added", description: "Unavailable time has been saved." });
    },
    onError: () => {
      toast({ title: "Failed to add blackout", description: "Please try again.", variant: "destructive" });
    },
  });

  const deleteBlackoutMutation = useMutation({
    mutationFn: async (blackoutId: number) => {
      const res = await apiRequest(
        "DELETE",
        `/api/providers/${providerId}/blackouts/${blackoutId}`,
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "blackouts"] });
      setSelectedEvent(null);
      toast({ title: "Blackout removed", description: "Availability has been restored." });
    },
    onError: () => {
      toast({ title: "Failed to remove blackout", description: "Please try again.", variant: "destructive" });
    },
  });

  const markCompleteMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, {
        status: "completed",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/provider", providerId] });
      setSelectedEvent(null);
      toast({ title: "Booking marked complete", description: "The visit status has been updated." });
    },
    onError: () => {
      toast({ title: "Failed to update booking", description: "Please try again.", variant: "destructive" });
    },
  });

  const createSeriesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bookings/series", {
        providerId,
        serviceId: Number(seriesForm.serviceId),
        startDate: seriesForm.startDate,
        visitCount: Number(seriesForm.visitCount),
        frequencyDays: Number(seriesForm.frequencyDays),
        timeSlot: seriesForm.timeSlot,
        patientAddress: seriesForm.patientAddress,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/provider", providerId] });
      setShowSeriesModal(false);
      setSeriesForm({
        serviceId: "",
        visitCount: 4,
        startDate: "",
        frequencyDays: 7,
        timeSlot: "09:00",
        patientAddress: "",
      });
      toast({ title: "Series scheduled", description: "Recurring visits have been created." });
    },
    onError: () => {
      toast({ title: "Failed to schedule series", description: "Please try again.", variant: "destructive" });
    },
  });

  const bookingEvents = useMemo(
    () =>
      bookings.map((b: any) => ({
        id: b.id,
        title: `${b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : "Patient"} — ${b.service?.name || "Visit"}`,
        start: new Date(b.scheduledDate),
        end: new Date(new Date(b.scheduledDate).getTime() + (b.duration || 60) * 60000),
        type: "booking",
        resource: b,
      })),
    [bookings],
  );

  const blackoutEvents = useMemo(
    () =>
      (blackouts as any[]).map((bl: any) => ({
        id: `blackout-${bl.id}`,
        title: bl.reason || "Unavailable",
        start: new Date(bl.startDate),
        end: new Date(bl.endDate),
        type: "blackout",
        allDay: true,
        resource: bl,
      })),
    [blackouts],
  );

  const events = [...bookingEvents, ...blackoutEvents];

  const eventPropGetter = (event: any) => ({
    style: {
      backgroundColor: event.type === "booking" ? "hsl(207,90%,54%)" : "#EF4444",
      borderRadius: "4px",
      border: "none",
      color: "white",
      fontSize: "12px",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Appointments Calendar</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setShowBlackoutModal(true)}>
            Add Blackout
          </Button>
          <Button
            className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
            onClick={() => setShowSeriesModal(true)}
          >
            Schedule Series
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.WEEK}
            style={{ height: 600 }}
            popup
            onSelectEvent={setSelectedEvent}
            eventPropGetter={eventPropGetter}
          />
        </CardContent>
      </Card>

      {selectedEvent && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedEvent.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedEvent.type === "booking" ? (
              <>
                <div>
                  <div className="text-sm text-gray-500">Patient</div>
                  <div className="font-medium text-gray-900">
                    {selectedEvent.resource.patient
                      ? `${selectedEvent.resource.patient.firstName} ${selectedEvent.resource.patient.lastName}`
                      : "Patient"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Service</div>
                  <div className="font-medium text-gray-900">
                    {selectedEvent.resource.service?.name || "Visit"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium text-gray-900">
                    {format(new Date(selectedEvent.resource.scheduledDate), "PPP p")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium text-gray-900">
                    {selectedEvent.resource.patientAddress || "No address provided"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-800">{selectedEvent.resource.status}</Badge>
                  <Badge className="bg-slate-100 text-slate-800">
                    {selectedEvent.resource.paymentStatus || "pending"}
                  </Badge>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => markCompleteMutation.mutate(selectedEvent.resource.id)}
                    disabled={markCompleteMutation.isPending || selectedEvent.resource.status === "completed"}
                  >
                    Mark Complete
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-sm text-gray-500">Date range</div>
                  <div className="font-medium text-gray-900">
                    {format(new Date(selectedEvent.resource.startDate), "PPP")} to{" "}
                    {format(new Date(selectedEvent.resource.endDate), "PPP")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Reason</div>
                  <div className="font-medium text-gray-900">
                    {selectedEvent.resource.reason || "Unavailable"}
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    variant="destructive"
                    onClick={() => deleteBlackoutMutation.mutate(selectedEvent.resource.id)}
                    disabled={deleteBlackoutMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showBlackoutModal} onOpenChange={setShowBlackoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Blackout</DialogTitle>
            <DialogDescription>Block off dates when you are unavailable.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blackout-start">Start date</Label>
              <Input
                id="blackout-start"
                type="date"
                value={blackoutForm.startDate}
                onChange={(event) =>
                  setBlackoutForm((prev) => ({ ...prev, startDate: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blackout-end">End date</Label>
              <Input
                id="blackout-end"
                type="date"
                value={blackoutForm.endDate}
                onChange={(event) =>
                  setBlackoutForm((prev) => ({ ...prev, endDate: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blackout-reason">Reason</Label>
              <Textarea
                id="blackout-reason"
                value={blackoutForm.reason}
                onChange={(event) =>
                  setBlackoutForm((prev) => ({ ...prev, reason: event.target.value }))
                }
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => addBlackoutMutation.mutate()}
                disabled={
                  addBlackoutMutation.isPending ||
                  !blackoutForm.startDate ||
                  !blackoutForm.endDate
                }
              >
                {addBlackoutMutation.isPending ? "Saving..." : "Save Blackout"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSeriesModal} onOpenChange={setShowSeriesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Series</DialogTitle>
            <DialogDescription>Create a recurring set of visits.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={seriesForm.serviceId}
                onValueChange={(value) =>
                  setSeriesForm((prev) => ({ ...prev, serviceId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {(providerServices as any[]).map((service) => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="visit-count">Visit count</Label>
                <Input
                  id="visit-count"
                  type="number"
                  min="1"
                  max="20"
                  value={seriesForm.visitCount}
                  onChange={(event) =>
                    setSeriesForm((prev) => ({
                      ...prev,
                      visitCount: Number(event.target.value || 1),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={String(seriesForm.frequencyDays)}
                  onValueChange={(value) =>
                    setSeriesForm((prev) => ({
                      ...prev,
                      frequencyDays: Number(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Weekly</SelectItem>
                    <SelectItem value="14">Bi-weekly</SelectItem>
                    <SelectItem value="30">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="series-start-date">Start date</Label>
                <Input
                  id="series-start-date"
                  type="date"
                  value={seriesForm.startDate}
                  onChange={(event) =>
                    setSeriesForm((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="series-time">Time</Label>
                <Input
                  id="series-time"
                  type="time"
                  value={seriesForm.timeSlot}
                  onChange={(event) =>
                    setSeriesForm((prev) => ({ ...prev, timeSlot: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="series-address">Patient address</Label>
              <Input
                id="series-address"
                value={seriesForm.patientAddress}
                onChange={(event) =>
                  setSeriesForm((prev) => ({
                    ...prev,
                    patientAddress: event.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => createSeriesMutation.mutate()}
                disabled={
                  createSeriesMutation.isPending ||
                  !seriesForm.serviceId ||
                  !seriesForm.startDate ||
                  !seriesForm.patientAddress
                }
              >
                {createSeriesMutation.isPending ? "Scheduling..." : "Create Series"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
