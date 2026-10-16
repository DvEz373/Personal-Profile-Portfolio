---
title: Power Plant Controller Models for PV Plants
category: controllers
kind: professional
order: 6
context: Client projects, controller models for grid studies
start: "2026"
blurb: Grid models of the controller that makes a solar plant act as one power station, ported to the simulation tool grid operators use.
role: Developed the PSS/E RMS models (user-defined) and ran the basic functional tests for the user guide.
problem: A power plant controller (PPC) sits at the point of connection (PoC) of a solar plant. It measures power, voltage and frequency there and sends setpoints to the inverters, so the whole plant meets the grid code. The controller manufacturer supplied detailed PSCAD models, but transmission system operators study the grid in PSS/E and need the same controller there.
approach: Two projects on the same controller. First we ported it function by function from PSCAD into a PSS/E user-defined model for a PV plant with six inverter units. Later we compared a newer PSCAD release with the old one module by module and updated the model for a second plant.
result: A PSS/E model that behaves like the PSCAD original in PSS/E 35 and 36, validated in 16 tests from the operator's list and documented in a 58-page user guide. The update lets the plant import power and drops a closed-source inverter model.
stack: [PSS/E, PSCAD, Fortran, Python]
facts:
  - { label: Plants, value: "Two PV plants of about 20 and 25 MVA" }
  - { label: Grid connection, value: "High-voltage transmission grid" }
  - { label: Validation, value: "16 tests from the operator's list" }
  - { label: Release update, value: "38 modules compared, 4 changed" }
  - { label: Software, value: "PSS/E 35 and 36" }
figures:
  - src: ../../assets/projects/pv-plant-controller-models/plant-overview.png
    alt: Single-line diagram of a PV plant with six inverter units on an MV collector, an HV/MV transformer and the point of connection to the grid, with the power plant controller measuring P, Q, V and f at the PoC and sending P and Q setpoints to the inverters.
    caption: The controller measures at the point of connection and sets every inverter.
  - src: ../../assets/projects/pv-plant-controller-models/test-network.png
    alt: Test network with one aggregated PV unit, LV, MV, HV and PoC buses, two transformers, a grid impedance and the power plant controller.
    caption: The aggregated test network used for the release update.
---

## What we did

1. **Port to PSS/E.** We rebuilt the controller from the manufacturer's PSCAD model as a user-defined Fortran model compiled to one DLL. It covers active power setpoints and ramp limits, frequency response (FSM, LFSM-O and LFSM-U), synthetic inertia and frequency restoration reserve, reactive power, power factor, Q(V), Q(P) and voltage control, power oscillation damping (POD) and fault ride-through.
2. **Test networks.** A detailed case with six PV units and their transformers, and an aggregated case with an adjustable grid source, where the short-circuit ratio (SCR) and X/R ratio set the grid strength.
3. **Release update.** A script parsed both PSCAD releases and compared them module by module. We applied the four changes to the Fortran model and recorded each against the PSCAD source. The main change lets the plant import power as well as export it.
4. **Generic inverters.** The old test setup used an inverter DLL without source code. We replaced it with standard, documented generic converter models.

## How we checked it

- We ran the 16 validation tests in PSS/E 35 and 36. Both versions give the same plant response; only the measured frequency differs a little, because the two releases use different default frequency filters.
- Python scripts run every control function and fault case, and step-by-step scripts let anyone repeat a test in the PSS/E interface. The manual runs match the automated runs exactly.
