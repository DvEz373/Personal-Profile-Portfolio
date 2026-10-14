---
title: Adjustable Speed Pumped Storage Model
category: machines
coverFocus: "0% 24.9%"
coverZoom: 1.57
kind: professional
order: 2
featured: true
context: Client project, plant model for grid studies
start: "2025"
blurb: Simulation models of a pumped storage plant whose units change speed to control power fast, built for the grid operator's study tools.
role: Developed the PSS/E RMS model (user-defined) and a simplified PSCAD EMT model for early benchmarking.
problem: Grid operators need a dynamic model of every large plant in their own study tools. An adjustable speed pumped storage unit runs on a doubly fed induction machine (DFIM) whose rotor is fed through a converter, and PSS/E has no library model for it. Its hydro governor models have no machine, and its induction machine models cannot feed a rotor winding.
approach: We wrote the unit as one user-defined PSS/E model. It follows the type 3 wind turbine (WT3) approach for the machine and its electrical control and swaps the wind parts for the governor, the waterway and the rotor inertia. A PSCAD EMT model with the full converter gave the reference response.
result: An RMS model compiled as one DLL for PSS/E 33 and 35. It stayed stable in nine tests in both generating and pumping mode and matched the PSCAD benchmark. The client received it with the network case, scripts, reports and a user guide.
stack: [PSS/E, PSCAD, Fortran, Python]
facts:
  - { label: Plant, value: "Gigawatt-class, several adjustable speed units" }
  - { label: Grid connection, value: "Extra-high-voltage transmission grid" }
  - { label: Machine, value: "Doubly fed induction machine, slip about ±10 %" }
  - { label: Tests, value: "Nine, each in generating and pumping mode" }
figures:
  - src: ../../assets/projects/pumped-storage-dfim-model/plant-overview.png
    alt: Pumped storage plant from upper to lower reservoir with one unit in detail, pump-turbine, doubly fed induction machine, rotor-side and grid-side converters and unit controller, connected through a step-up transformer to the grid; three more units in outline.
    caption: One unit in detail, from the waterway to the grid connection.
  - src: ../../assets/projects/pumped-storage-dfim-model/model-structure.png
    alt: Two block chains side by side, the PSS/E type 3 wind turbine models and the pumped storage user model. Pitch control and aerodynamics are replaced by governor and hydraulics; electrical control and converter follow the same approach.
    caption: The user model keeps the WT3 approach for the machine and swaps the wind parts for hydro.
  - src: ../../assets/projects/pumped-storage-dfim-model/workflow.png
    alt: Five steps from reference data to EMT model, RMS model, test bench and benchmark, with nine validation tests run in generating and pumping mode.
    caption: How we built the model and checked it against PSCAD.
---

## What we did

1. **Reference data.** We took the control structure and settings from the manufacturer's control diagrams, with the machine and turbine data.
2. **EMT models.** A simplified PSCAD model gave the first benchmarks. A detailed one with the full back-to-back converter became the reference.
3. **RMS model.** We wrote the unit in Fortran as one user-defined model and compiled it as one DLL for PSS/E 33 and 35. It covers active power and speed control, reactive power and voltage control, frequency response in frequency sensitive mode (FSM) and limited frequency sensitive mode (LFSM), the waterway and rotor inertia, and both operating modes. As in WT3, a current source stands in for the rotor converter; the grid side converter and the phase-locked loop are left out.

## How we checked it

- A test network with terminal, MV and HV buses, the step-up transformer and a test grid with a short-circuit ratio (SCR) of 10 and X/R of 10. A playback source applied the voltage and frequency events.
- Nine tests in each mode: flat run, P, Q and V steps, low- and high-voltage ride-through, over- and under-frequency, and a three-phase fault. The unit stayed stable in every case, and we compared each PSS/E response with PSCAD.
