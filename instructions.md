JITSTIMER — Jitsu Training Timer Web Application

⸻

1. Product Overview

This web application is designed to support Brazilian Jiu-Jitsu academies during training sessions by providing a synchronized timing and control interface for both instructors and students.

It consists of two distinct but connected user interfaces:
	•	TV Interface: A clean, minimalistic public display that shows the current timer status.
	•	Mobile Interface: A control panel used by the instructor to configure, start, pause, resume, or reset the training session.

The system should be optimized for real-time use in a sports training environment with high visual clarity and reliable timer accuracy.

⸻

2. Core Use Case

A BJJ instructor uses their mobile phone to start a training session consisting of multiple rounds of timed sparring (fight) and rest. The countdown timer is displayed prominently on a large TV screen in the training area. The instructor can pause the timer, resume it, or reset the entire session at any time.

⸻

3. Functional Requirements

3.1 Mobile Interface (Instructor Control Panel)

Input Fields
	•	Fight Time (minutes + seconds input)
	•	Rest Time (minutes + seconds input)
	•	Number of Rounds (numeric input)

Buttons
	•	Main Action Button: dynamic label and logic
	•	State 1: Start Training
	•	State 2: Pause Training
	•	State 3: Resume Training
	•	Reset Button: always visible, resets entire session

Information Display
	•	Current round: e.g., “Round 3 of 6”
	•	Current phase: Fight, Rest, or Finished
	•	Live countdown timer (mirrors the TV screen)

Logic
	•	On “Start Training”:
	•	Timer begins counting down fight time
	•	Round 1 of X starts
	•	On “Pause Training”:
	•	Timer stops
	•	On “Resume Training”:
	•	Timer resumes from the last position
	•	On completion of fight time:
	•	Automatically transitions to rest time
	•	On completion of rest time:
	•	Automatically increments the round and starts new fight round
	•	On completion of all rounds:
	•	Timer stops and system enters the Finished state

⸻

3.2 TV Interface (Public View)
	•	Full-screen timer display
	•	Color background or accents based on current state
	•	Green: Fight
	•	Blue: Rest
	•	Gray: Finished
	•	Text label indicating:
	•	“Fight”
	•	“Rest”
	•	“Finished”
	•	Must be highly visible from a distance (4+ meters)

⸻

4. Timer Logic Breakdown

Timer Phases

Each round contains two consecutive timers:
	1.	Fight Phase
	•	Duration: user-defined
	•	State name: Fight
	•	On completion: transition to Rest
	2.	Rest Phase
	•	Duration: user-defined
	•	State name: Rest
	•	On completion: transition to next round or Finished

Round Progression
	•	Total rounds = user-defined
	•	After final rest phase, the system enters the Finished state
	•	The Reset button restores the application to its initial configuration state

⸻

5. States and UI Behavior

State	Timer Running	Main Button Label	Background Color	Notes
Idle	No	Start Training	Default (Dark)	Awaiting user input
Fight	Yes	Pause Training	Green	Current round in progress
Fight (Paused)	No	Resume Training	Green (dimmed)	Timer is paused
Rest	Yes	Pause Training	Blue	Rest period
Rest (Paused)	No	Resume Training	Blue (dimmed)	Timer is paused
Finished	No	Start Training	Gray	All rounds completed


⸻

6. Reset Function

The “Reset” button must:
	•	Stop any active timers
	•	Clear current round and phase
	•	Return all buttons and inputs to their initial state
	•	Reset the TV interface to default (no timer running, no color background)

⸻

7. Non-Functional Requirements
	•	Real-time synchronization between the control interface and TV display (can be mocked locally in MVP using shared local state)
	•	Offline Support (optional): The app should function in environments with unstable internet (MVP can be offline-first or local-only)
	•	Touch-friendly controls: Large buttons and clear interactions for use on mobile phones

⸻

8. Future Enhancements (Optional / V2)
	•	WebSocket-based real-time sync across devices
	•	Session logging and training reports
	•	Authentication for instructors
	•	Support for other training types (e.g., circuit training)
	•	Sound notifications or vibration feedback
	•	Multilingual support: English, Portuguese

⸻

9. Development Notes for AI Builder

When using an AI interface builder (e.g., Lovable, FlutterFlow, etc.), please ensure:
	•	All labels are dynamic and respond to state changes.
	•	Use condition-based UI logic to swap the main button label and timer behavior.
	•	Group timer logic and state transitions into a clean state machine or logic flow chart.
	•	Split the UI into two modes: Control Mode (Mobile) and Display Mode (TV).
	•	Maintain a clean architecture: clear separation between UI, state logic, and timer controller.