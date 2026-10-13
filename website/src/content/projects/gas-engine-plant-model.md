---
title: Gas Engine Power Plant Model
category: energy
kind: professional
order: 7
coverFocus: "0% 8%"
coverZoom: 1.5
context: Client project, plant model for grid connection
start: "2026"
blurb: A grid model that shows how a gas engine power plant handles faults and frequency events before the plant first runs.
role: Developed the PSS/E RMS model (user-defined), ran the basic functional tests for the user guide and the steady-state studies (load flow, short circuit, PQ capability).
problem: Before a new plant connects to the transmission grid, the grid operator needs a dynamic model to check how it responds to faults, voltage dips and frequency events. The manufacturer had a detailed PSCAD model of the gas engine units, but the operator's studies run in PSS/E.
approach: We built the PSS/E network case, used library models for the generators and exciters, and wrote one user-defined Fortran model for each unit's engine, governor and plant controller, converted from the manufacturer's PSCAD model into an RMS model.
result: A validated RMS model that passed 13 grid-code test scenarios and a third-party pre-validation, delivered with the network case, dynamic data, a test script and a user guide.
stack: [PSS/E, Fortran, Python, PSCAD]
facts:
  - { label: Plant, value: "Five gas engine units of about 12 MVA each" }
  - { label: Export, value: "About 50 MW at full load" }
  - { label: Grid connection, value: "High-voltage transmission grid" }
  - { label: Tests, value: "13 grid-code scenarios" }
  - { label: Review, value: "Third-party pre-validation" }
figures:
  - src: ../../assets/projects/gas-engine-plant-model/plant-overview.png
    alt: Gas engine power plant with five generator units on an MV bus, a step-up transformer and the point of connection to the grid. Unit 1 shows its plant controller in detail, with speed governor, AVR and exciter, P controller, Q and power factor controller and grid support.
    caption: Five units, each with its own plant controller, from engine to grid connection.
---

## What we did

1. **Network model.** The PSS/E load flow case from the single-line diagram, the cable and transformer data and the short-circuit study of the grid connection.
2. **Steady-state studies.** Load flow, short circuit and the plant's active and reactive power (PQ) capability.
3. **Generators and excitation.** Standard PSS/E library models for the salient-pole generators and the AC excitation system, set up from the manufacturer's datasheets.
4. **User-defined model.** One Fortran model per unit, compiled to a DLL: the gas engine from injection command to shaft torque, the speed governor and actuator, P and Q or power factor control with ramp rates and capability limits, P(f) and Q(V) grid support, and fault ride-through.
5. **EMT to RMS.** We converted the manufacturer's PSCAD model into a phasor-domain RMS model that keeps the behaviour grid studies need.

## How we checked it

- 13 test scenarios from the grid code: flat run, P, Q and power factor steps, low- and high-voltage ride-through, fault ride-through, over- and under-frequency events, and P(f) and Q(V) grid support. A playback file drives the grid voltage and frequency.
- A third party pre-validated the model, and we fed its findings back into the model.
