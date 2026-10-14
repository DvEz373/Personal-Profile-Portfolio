---
title: Synchronous Condenser Model and Automated Test Bench
category: machines
kind: professional
order: 3
featured: true
coverFocus: "8% 62%"
coverZoom: 1.15
context: Client project, model for grid connection
start: "2026"
blurb: A grid model of a spinning machine that steadies voltage without making power, checked against the manufacturer's model in 163 automated test cases.
role: Control engineer for the model development, building the PSS/E RMS model (user-defined and generic) and benchmarking it against PSCAD. Power system engineer for the dynamic and steady-state studies (short circuit, load flow, QV capability, component current ratings).
problem: A synchronous condenser supports the grid with voltage control, system strength and inertia without producing active power. Before it can connect, the owner must give the grid operator a dynamic model that behaves like the real plant in every case of the operator's model acceptance tests.
approach: We built the PSS/E model from standard IEEE machine, exciter and stabiliser models plus a user-written model of the plant controller and the protective limiters. A Python test bench runs every acceptance case in PSS/E and in PSCAD under the same conditions and compares them signal by signal.
result: A PSS/E model that tracks the manufacturer's PSCAD model across the full test set, a test bench that re-runs, re-checks and re-reports all 163 cases with one command, and standalone case scripts the client and the grid operator can run on their own.
stack: [PSS/E, PSCAD/EMTDC, Fortran, Python]
facts:
  - { label: Machine, value: "Synchronous condenser of about 160 MVA" }
  - { label: Grid connection, value: "High-voltage transmission grid" }
  - { label: Test set, value: "163 acceptance test cases" }
  - { label: Reference, value: "Manufacturer's PSCAD EMT model" }
figures:
  - src: ../../assets/projects/synchronous-condenser-model/network-overview.png
    alt: Single-line diagram of a synchronous condenser through a step-up transformer with on-load tap changer to the grid, with the excitation system (AVR and exciter, protective limiters, stabiliser) and the plant controller that sets the voltage reference from measurements at the point of connection.
    caption: The condenser, its excitation system and the plant controller, from machine terminal to grid.
---

## What we did

1. **Model development.** Standard IEEE models for the machine, the exciter and the power system stabiliser (PSS), combined with a user-written Fortran model of the plant controller and the protective limiters (over- and under-excitation, stator current, V/Hz).
2. **Benchmarking.** Each acceptance case ran in PSS/E and in PSCAD, and we compared the responses at the machine terminal and at the point of connection. The cases cover grid faults, voltage, frequency and phase-angle disturbances, temporary overvoltage and limiter operation, on weak and strong grids.
3. **Steady-state studies.** Short circuit, load flow, reactive power against voltage (QV) capability and the current ratings of the plant components.
4. **Automation.** A Python pipeline runs all 163 cases, writes a standalone script per case, checks those scripts against the automated runs and produces the overlay plots, error metrics and report appendices.

## How we checked it

- We traced each remaining difference between PSS/E and PSCAD to its source, for example transformer magnetising current, tap position, fault impedance and limiter interaction, and either fixed it or documented it.
- The standalone scripts reproduce the automated results to numerical precision, so anyone with the model can repeat a test.
