---
title: Excitation Limiter Models for a Combined-Cycle Plant
category: machines
coverFocus: "38.4% 6.7%"
coverZoom: 2.42
kind: professional
order: 5
context: Client project, plant model for grid studies
start: "2026"
blurb: Grid models of the limits that keep a large power plant's generators inside safe operation, written where the standard simulation library has none.
role: Developed the PSS/E RMS models (user-defined) and ran the basic functional tests for the user guide.
problem: Grid studies of a plant are only as good as its dynamic models. On a gigawatt-class combined-cycle plant, three of the limiters that keep each generator inside its safe operating area had no PSS/E library model. The client also needed the same results in two PSS/E releases with different interfaces for user models.
approach: We translated the manufacturer's drawings of the limiter logic into a model specification and wrote the three limiters as user-defined Fortran models, one source per PSS/E release. After every run, an automatic check rebuilds each block of that logic from the model outputs and compares the two releases.
result: The three limiters now run in PSS/E for this plant and match the manufacturer's logic, with the same plant behaviour in PSS/E 33 and 36. The client received four package releases, each answering its feedback.
stack: [PSS/E, Fortran, Python]
facts:
  - { label: Plant, value: "Gigawatt-class combined cycle, three gas and one steam turbine unit" }
  - { label: Grid connection, value: "Extra-high-voltage transmission grid" }
  - { label: Models, value: "Two V/Hz limiters and a stator current limiter" }
  - { label: Software, value: "PSS/E 33 and 36" }
  - { label: Releases, value: "Four, each after client feedback" }
figures:
  - src: ../../assets/projects/ccgt-excitation-limiters/plant-control.png
    alt: Combined-cycle plant with three gas turbine generators and one steam turbine generator fed by a heat recovery steam generator, each connected through a step-up transformer to the HV bus and the grid. The first gas turbine unit and the steam turbine unit show their control in detail, with governor, AVR and exciter, stabiliser and limiters.
    caption: The plant and the control of each unit, with the limiters this project added.
  - src: ../../assets/projects/ccgt-excitation-limiters/unit-models.png
    alt: Block diagram of the dynamic models of one unit, PSS/E library models for the generator, exciter, stabiliser, under- and over-excitation limiters and governor, and one user-defined model for the V/Hz and stator current limiters that feeds the voltage reference.
    caption: Library models plus one user-defined limiter model on each of the four machines.
---

## What we did

1. **Specification.** The manufacturer's drawings of the exciter and limiter logic became a block-by-block model specification.
2. **User models.** A volts-per-hertz (V/Hz) limiter for the gas turbine generators, and a V/Hz limiter and a stator current limiter for the steam turbine generator, written in Fortran and built as model libraries for PSS/E 33 and 36.
3. **Plant model.** Generators, exciters, stabilisers, limiters, governors, step-up transformers and a grid equivalent.
4. **Tests.** The client's test set on the whole plant: grid frequency ramps (rate of change of frequency, RoCoF), grid voltage steps, AVR reference steps and three-phase faults.
5. **Packages.** Model libraries, case, dynamic data, one script per test and the reference results.

## How we checked it

- After each simulation, a script rebuilds every block of the manufacturer's logic from the model outputs at each time step and compares it with the model, and compares PSS/E 33 with PSS/E 36.
- Each release answered client feedback, for example letting the standard PSS/E commands move the voltage setpoint.
