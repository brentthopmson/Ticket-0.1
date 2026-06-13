# Plan: Revert AddTicketModal in 3 apps + Make AddUserModal fields editable

## Step 1: Revert AddTicketModal in Ticket-0.1, Viagogo-0.1, uefa

For each of these 3 apps, remove from `AddTicketModal.tsx`:

### a. Remove aiPrefill handling
```
gate: aiPrefill.gate || prev.gate,
entrance: aiPrefill.entrance || prev.entrance,
hospitalityArea: aiPrefill.hospitalityArea || prev.hospitalityArea,
```

### b. Remove formData state
```
gate: '',
entrance: '',
hospitalityArea: '',
```

### c. Remove 3 input field JSX blocks (Gate, Entrance, Hospitality Area)

**Files:**
- `Ticket-0.1/app/components/AddTicketModal.tsx`
- `Viagogo-0.1/app/components/AddTicketModal.tsx`
- `uefa/app/components/AddTicketModal.tsx`

**FIFA AddTicketModal stays untouched.**

---

## Step 2: Add gate/entrance/hospitalityArea to UserTable formData (all 4 apps)

### a. `fifa/app/components/UserTable.tsx`
- Add to `NewUserFormData` interface: `gate: string; entrance: string; hospitalityArea: string;`
- Add to `useState<NewUserFormData>` initial state: `gate: '', entrance: '', hospitalityArea: '',`

### b. `Ticket-0.1/app/components/UserTable.tsx`
- Add to `NewUserFormData` interface: `gate: string; entrance: string; hospitalityArea: string;`
- Add to `useState<NewUserFormData>` initial state: `gate: '', entrance: '', hospitalityArea: '',`

### c. `Viagogo-0.1/app/components/UserTable.tsx`
- Add to inline `useState({})` initial state: `gate: '', entrance: '', hospitalityArea: '',`

### d. `uefa/app/components/UserTable.tsx`
- Add to inline `useState({})` initial state: `gate: '', entrance: '', hospitalityArea: '',`

---

## Step 3: Update AddUserModal props + make fields editable (all 4 apps)

For each of the 4 apps' `AddUserModal.tsx`:

### a. Add 3 fields to formData interface (props type)
Add `gate: string; entrance: string; hospitalityArea: string;` to the `formData` type in `AddUserModalProps` and the `setFormData` dispatch type.

### b. Pre-populate in handleTicketChange
When a ticket is selected, also set the 3 fields from the ticket:
```ts
setFormData(prev => ({
  ...prev,
  seatNumbers: selectedTicket?.seatNumbers || '',
  gate: selectedTicket?.gate || '',
  entrance: selectedTicket?.entrance || '',
  hospitalityArea: selectedTicket?.hospitalityArea || '',
  transferringSeatNumbers: ''
}));
```

### c. Change inputs from readOnly to editable
Replace the IIFE read-only block with proper editable inputs wired to formData:
```tsx
{formData.gate !== undefined && (
  <div className="md:col-span-2 grid grid-cols-3 gap-3">
    <div>
      <label className="...">Gate</label>
      <input type="text" name="gate" value={formData.gate} onChange={handleChange} className="..." />
    </div>
    <div>
      <label className="...">Entrance</label>
      <input type="text" name="entrance" value={formData.entrance} onChange={handleChange} className="..." />
    </div>
    <div>
      <label className="...">Hospitality Area</label>
      <input type="text" name="hospitalityArea" value={formData.hospitalityArea} onChange={handleChange} className="..." />
    </div>
  </div>
)}
```

### d. Update payload to use formData values
Replace:
```ts
const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId);
if (selectedTicket) {
  if (selectedTicket.gate) payload.append('gate', selectedTicket.gate);
  if (selectedTicket.entrance) payload.append('entrance', selectedTicket.entrance);
  if (selectedTicket.hospitalityArea) payload.append('hospitalityArea', selectedTicket.hospitalityArea);
}
```
With:
```ts
if (formData.gate) payload.append('gate', formData.gate);
if (formData.entrance) payload.append('entrance', formData.entrance);
if (formData.hospitalityArea) payload.append('hospitalityArea', formData.hospitalityArea);
```

---

## Files touched (summary)

| File | Action |
|------|--------|
| `Ticket-0.1/app/components/AddTicketModal.tsx` | Remove 3 fields (aiPrefill + formData + inputs) |
| `Viagogo-0.1/app/components/AddTicketModal.tsx` | Remove 3 fields |
| `uefa/app/components/AddTicketModal.tsx` | Remove 3 fields |
| `fifa/app/components/UserTable.tsx` | Add 3 fields to interface + initial state |
| `Ticket-0.1/app/components/UserTable.tsx` | Add 3 fields to interface + initial state |
| `Viagogo-0.1/app/components/UserTable.tsx` | Add 3 fields to initial state |
| `uefa/app/components/UserTable.tsx` | Add 3 fields to initial state |
| `fifa/app/components/AddUserModal.tsx` | Make fields editable + update handleTicketChange + payload |
| `Ticket-0.1/app/components/AddUserModal.tsx` | Make fields editable + update handleTicketChange + payload |
| `Viagogo-0.1/app/components/AddUserModal.tsx` | Make fields editable + update handleTicketChange + payload |
| `uefa/app/components/AddUserModal.tsx` | Make fields editable + update handleTicketChange + payload |

## Verification
- Run `npx tsc --noEmit` in all 4 apps
