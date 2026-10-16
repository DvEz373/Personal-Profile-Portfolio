---
title: Biogas CHP Plant Controller Model
category: controllers
coverFocus: "1.6% 0%"
coverZoom: 1.42
kind: professional
order: 8
context: Client project, plant model for grid connection
start: "2025"
blurb: A grid model of a small biogas power plant's controller, matched to its detailed model so the network company can study the connection.
role: Developed the PSS/E RMS model (user-defined) and the PSCAD EMT model, and ran the basic functional tests for the user guide.
problem: A new generator needs validated dynamic models before it can connect, and the network company uses them in its connection studies. This plant burns biogas in three gas engines that drive synchronous generators and recovers the engine heat. A detailed PSCAD model of the gensets existed, but the PSS/E model did not reproduce its control behaviour.
approach: We corrected the PSCAD model so it could serve as the reference, wrote a user-defined PSS/E model of the plant controller and genset controls, and ran the same eight tests in both tools, following the market operator's model guidelines.
result: The PSS/E model tracks every setpoint and droop characteristic of the PSCAD model. In the fault test, voltage and reactive power match; active power overshoots more in PSS/E after the fault clears, as an RMS simulation should.
stack: [PSS/E, PSCAD, Fortran, Python]
facts:
  - { label: Plant, value: "Biogas CHP of about 5 MW, three gensets" }
  - { label: Grid connection, value: "Medium-voltage distribution network" }
  - { label: Benchmark, value: "Eight tests, PSS/E against PSCAD" }
  - { label: Test grid, value: "Short-circuit ratio 30, X/R 3" }
figures:
  - src: ../../assets/projects/biogas-chp-plant-controller/plant-overview.png
    alt: Single-line diagram of a biogas combined heat and power plant with three gas engine gensets on an LV bus, a step-up transformer, the MV bus and the point of connection to the grid, with the power plant controller sending speed and voltage setpoints from terminal measurements.
    caption: Three gensets and the plant controller, from the engines to the point of connection.
  - src: ../../assets/projects/biogas-chp-plant-controller/aggregated-model.png
    alt: The same network with the three gensets replaced by one equivalent genset, as used in the PSS/E model.
    caption: For grid studies the three gensets become one equivalent machine.
---

## What we did

1. **PSCAD reference.** We reviewed the PSCAD model against its modelling manual and corrected the grid support block, the power controller inputs and the voltage controller.
2. **User-defined model.** A Fortran model with the outer P and Q control, the governor and engine, and the voltage control. It drives the standard PSS/E GENROU generator and AC8B exciter models through two signals only: a speed setpoint and a voltage setpoint. It covers P and Q setpoints with ramp limits, power factor control, P(f) and Q(V) droop, load sharing, voltage limiting at under-frequency and line-drop compensation.
3. **Aggregation.** The three gensets became one equivalent machine, with the controller settings converted to that machine and to the PSS/E system base.
4. **Delivery.** The compiled model, dynamic data, network case, playback file and script, the updated PSCAD model, a modelling manual and the benchmark plots.

## How we checked it

- Eight tests in both tools: steps in active power, reactive power and power factor; over- and under-frequency P(f) droop; over- and under-voltage Q(V) droop; and low-voltage ride-through (LVRT) for a three-phase fault at the point of connection.
- We overlaid the PSS/E and PSCAD responses for each test and explained the one expected difference, the active power overshoot after the fault.
