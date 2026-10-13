---
title: Grid Compliance Model for a Hyperscale Data Center
category: energy
kind: professional
order: 1
featured: true
coverFocus: "50% 6%"
coverZoom: 1.4
context: Client project, grid connection study
start: "2025"
blurb: How a data center with over 100 MW of IT load behaves on the transmission grid, modelled up from one validated 3 kW power supply.
role: Built the MATLAB and PSCAD models, developed the benchmark measurement test bench and validated the model against it.
problem: The facility connects to the high-voltage transmission network with over 100 MW of IT load, so under the grid code for demand connection it counts as a large demand facility and must prove in simulation how it rides through grid disturbances. Almost all of that load is tens of thousands of single-phase 3 kW power supply units (PSUs), each a small converter with its own control and protection.
approach: Model one PSU in detail and validate it against laboratory measurements, then place it, aggregated, in an EMT model of the whole facility network and derive an equivalent RMS model for the transmission system operator.
result: A compliance case built on a measured converter model instead of a generic load, with fault ride-through, voltage, frequency, phase-jump, RoCoF and harmonic results at the point of connection, plus a black-box RMS model and user manual the TSO can use in its own studies.
stack: [MATLAB/Simulink, PSCAD/EMTDC, PowerFactory]
facts:
  - { label: Facility, value: "Over 100 MW of IT load, two buildings" }
  - { label: Grid connection, value: "High-voltage transmission network" }
  - { label: Main load, value: "Tens of thousands of single-phase 3 kW PSUs" }
  - { label: Framework, value: "Grid code for demand connection" }
figures:
  - src: ../../assets/projects/datacenter-grid-compliance/facility-overview.png
    alt: Single-line diagram from the high-voltage grid connection through HV/MV and MV/LV transformers to banks of power supply units, with one representative PSU expanded into rectifier, DC link and DC/DC converter.
    caption: From the grid connection down to the representative power supply unit.
  - src: ../../assets/projects/datacenter-grid-compliance/psu-topology.png
    alt: Power supply unit topology, an AC/DC rectifier with power factor correction feeding a DC link capacitor and a DC/DC converter.
    caption: The PSU modelled in EMT, from AC input to the DC output that feeds the IT load.
---

## What we did

1. **PSU model and validation.** A detailed electromagnetic transient (EMT) model of the PSU in MATLAB/Simulink: the AC/DC rectifier with power factor correction, the DC link, the DC/DC converter, the control loops and the shutdown logic. It was compared with laboratory measurements for normal operation, low- and high-voltage ride-through, load steps, phase jumps and rate-of-change-of-frequency events, and tuned until it met the accuracy requirements.
2. **Facility EMT model.** The validated PSU moved into PSCAD inside a model of the complete network: the HV grid equivalent, HV/MV and MV/LV transformers, cables, and cooling, UPS and auxiliary loads. Identical feeders and PSUs were aggregated into representative units, as the network code allows, which keeps simulations fast without changing what the grid sees.
3. **RMS model.** An equivalent RMS model in PowerFactory for the TSO's planning and stability studies, delivered as a black box with a user manual.
4. **Harmonics.** The facility's harmonic emission at the point of connection, checked against the applicable limits.
5. **Compliance simulations.** The grid-code test cases on the facility model, with the response at the point of connection documented against the TSO requirements.

## Why it matters

Because the facility model is built from a measured converter rather than a generic load, its response to grid events can be trusted. The owner gets a compliance case it can defend, and the TSO gets a model it can reuse.
