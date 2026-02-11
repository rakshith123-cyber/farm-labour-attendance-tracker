# Specification

## Summary
**Goal:** Fix the attendance quick-selector so selecting the 4th option (“Absent”) saves and displays the correct absent status instead of clearing or saving the wrong mark.

**Planned changes:**
- Update the frontend “Absent” selector option to call `setAttendance(workerId, date, AttendanceStatus.absent)` instead of using the `clearAttendance` flow.
- Ensure the backend persists the selected worker/date record with `status = absent` when Absent is chosen.
- Adjust the user-facing toast/feedback text for the Absent action to correct English (e.g., “Marked absent”) without changing behavior of the other three options.

**User-visible outcome:** When a user selects “Absent” for a worker/date, the cell consistently shows the Absent/Clear (white) state on reopen and the saved attendance status is correctly stored as absent.
